import React, { useCallback, useRef, useState, useEffect } from 'react';
import useMicrophoneAnalyser from './useMicrophoneAnalyser';

export interface RecordingData {
  blob: Blob;
  duration: number;
  size: number;
  mimeType: string;
}

interface UseAudioRecordingResult {
  // Recording state
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  recordingData: RecordingData | null;

  // Audio analysis
  analyser: AnalyserNode | null;

  // Controls
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<RecordingData | null>;
  pauseRecording: () => void;
  resumeRecording: () => Promise<void>;
  discardRecording: () => void;

  // Error handling
  error: string | null;
  clearError: () => void;
}

const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/wav'
];

const getSupportedMimeType = (): string => {
  for (const mimeType of SUPPORTED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  // Fallback to default
  return 'audio/webm';
};

const useAudioRecording = (maxDuration = 30000): UseAudioRecordingResult => {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingData, setRecordingData] = useState<RecordingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use microphone analyser for real-time audio visualization
  const {
    analyser,
    start: startMicrophone,
    stop: stopMicrophone,
    error: microphoneError,
    clearError: clearMicrophoneError
  } = useMicrophoneAnalyser();

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingPromiseResolverRef = useRef<((data: RecordingData | null) => void) | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    clearMicrophoneError();
  }, [clearMicrophoneError]);

  // Update recording time
  const updateRecordingTime = useCallback(() => {
    if (startTimeRef.current && !isPaused) {
      const elapsed = Date.now() - startTimeRef.current;
      setRecordingTime(elapsed);

      // Auto-stop at max duration
      if (elapsed >= maxDuration) {
        stopRecording();
        return;
      }
    }

    timerRef.current = setTimeout(updateRecordingTime, 100);
  }, [isPaused, maxDuration]);

  const startRecording = useCallback(async (): Promise<void> => {
    if (isRecording) return;

    try {
      clearError();

      // Start microphone for analysis
      await startMicrophone();

      // Get user media for recording
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;

      // Determine supported MIME type
      const mimeType = getSupportedMimeType();

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const duration = recordingTime;

        const data: RecordingData = {
          blob,
          duration,
          size: blob.size,
          mimeType
        };

        setRecordingData(data);

        // Resolve the promise with the recording data
        if (recordingPromiseResolverRef.current) {
          recordingPromiseResolverRef.current(data);
          recordingPromiseResolverRef.current = null;
        }

        cleanup();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording failed. Please try again.');

        // Resolve the promise with null in case of error
        if (recordingPromiseResolverRef.current) {
          recordingPromiseResolverRef.current(null);
          recordingPromiseResolverRef.current = null;
        }

        cleanup();
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
      setRecordingTime(0);

      // Start timer
      updateRecordingTime();

    } catch (recordingError) {
      console.error('Failed to start recording:', recordingError);

      let errorMessage = 'Failed to start recording. ';

      if (recordingError instanceof DOMException) {
        if (recordingError.name === 'NotAllowedError') {
          errorMessage += 'Please allow microphone access and try again.';
        } else if (recordingError.name === 'NotFoundError') {
          errorMessage += 'No microphone found. Please connect a microphone and try again.';
        } else {
          errorMessage += recordingError.message;
        }
      } else if (recordingError instanceof Error) {
        errorMessage += recordingError.message;
      } else {
        errorMessage += 'Unknown error occurred.';
      }

      setError(errorMessage);
      cleanup();
      throw recordingError;
    }
  }, [isRecording, startMicrophone, clearError, updateRecordingTime, recordingTime]);

  const stopRecording = useCallback(async (): Promise<RecordingData | null> => {
    if (!isRecording || !mediaRecorderRef.current) {
      return recordingData;
    }

    try {
      // Create a promise that resolves when MediaRecorder finishes
      const recordingPromise = new Promise<RecordingData | null>((resolve) => {
        recordingPromiseResolverRef.current = resolve;
      });

      // Stop the MediaRecorder
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Stop microphone
      stopMicrophone();

      setIsRecording(false);
      setIsPaused(false);

      // Clear timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Wait for the MediaRecorder to complete processing
      const finalRecordingData = await recordingPromise;
      return finalRecordingData;

    } catch (stopError) {
      console.error('Error stopping recording:', stopError);
      setError('Failed to stop recording properly.');

      // Clean up the promise resolver
      if (recordingPromiseResolverRef.current) {
        recordingPromiseResolverRef.current(null);
        recordingPromiseResolverRef.current = null;
      }

      cleanup();
      return null;
    }
  }, [isRecording, recordingData, stopMicrophone]);

  const pauseRecording = useCallback(() => {
    if (!isRecording || isPaused || !mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      // Clear timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

    } catch (pauseError) {
      console.error('Error pausing recording:', pauseError);
      setError('Failed to pause recording.');
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(async (): Promise<void> => {
    if (!isRecording || !isPaused || !mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Adjust start time to account for pause duration
      const pauseDuration = Date.now() - startTimeRef.current - recordingTime;
      startTimeRef.current = Date.now() - recordingTime;

      // Resume timer
      updateRecordingTime();

    } catch (resumeError) {
      console.error('Error resuming recording:', resumeError);
      setError('Failed to resume recording.');
    }
  }, [isRecording, isPaused, recordingTime, updateRecordingTime]);

  const discardRecording = useCallback(() => {
    cleanup();
    setRecordingData(null);
    setRecordingTime(0);
  }, []);

  const cleanup = useCallback(() => {
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (stopError) {
        console.warn('Error stopping MediaRecorder during cleanup:', stopError);
      }
    }
    mediaRecorderRef.current = null;

    // Stop stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Clean up promise resolver
    if (recordingPromiseResolverRef.current) {
      recordingPromiseResolverRef.current(null);
      recordingPromiseResolverRef.current = null;
    }

    // Stop microphone
    stopMicrophone();

    // Reset state
    setIsRecording(false);
    setIsPaused(false);
    chunksRef.current = [];
    startTimeRef.current = 0;
  }, [stopMicrophone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Handle microphone errors
  useEffect(() => {
    if (microphoneError && !error) {
      setError(microphoneError);
    }
  }, [microphoneError, error]);

  return {
    // State
    isRecording,
    isPaused,
    recordingTime,
    recordingData,
    analyser,

    // Controls
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    discardRecording,

    // Error handling
    error: error || microphoneError,
    clearError
  };
};

export default useAudioRecording;

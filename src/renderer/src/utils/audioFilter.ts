/**
 * Audio filtering utility for Viteelectronapptemplate application
 * Provides low-pass filtering for heart sound recordings to focus on 0-1000Hz range
 */

type AudioContextConstructor = typeof AudioContext;

type ExtendedWindow = Window & {
  webkitAudioContext?: AudioContextConstructor;
};

const getAudioContext = (): AudioContext => {
  const extendedWindow = window as ExtendedWindow;
  const AudioContextCtor =
    window.AudioContext || extendedWindow.webkitAudioContext;

  if (!AudioContextCtor) {
    throw new Error("Web Audio API is not supported in this environment");
  }

  return new AudioContextCtor();
};

export interface FilteredAudioPlayer {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  currentTime: number;
  duration: number;
  onended?: (() => void) | null;
  onerror?: ((error: Error) => void) | null;
}

/**
 * Creates a filtered audio player that applies a low-pass filter at 1000Hz
 * This filters heart sound recordings to focus on the medically relevant frequency range
 * @param audioBlob - The audio data as a Blob
 * @returns Promise<FilteredAudioPlayer> - A player interface with filtering applied
 */
export const createFilteredAudioPlayer = async (
  audioBlob: Blob,
): Promise<FilteredAudioPlayer> => {
  const audioContext = getAudioContext();

  // Convert blob to ArrayBuffer and decode
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Create and configure the low-pass filter
  const lowPassFilter = audioContext.createBiquadFilter();
  lowPassFilter.type = "lowpass";
  lowPassFilter.frequency.setValueAtTime(1000, audioContext.currentTime); // 1000Hz cutoff
  lowPassFilter.Q.setValueAtTime(0.7, audioContext.currentTime); // Moderate resonance

  // Track the current source node for control
  let currentSource: AudioBufferSourceNode | null = null;
  let isPlaying = false;
  let isPaused = false;
  let startTime = 0;
  let pauseTime = 0;

  // Event handlers
  let onEndedHandler: (() => void) | null = null;
  let onErrorHandler: ((error: Error) => void) | null = null;

  const cleanup = () => {
    if (currentSource) {
      try {
        currentSource.disconnect();
        currentSource.stop();
      } catch (error) {
        // Ignore errors during cleanup
      }
      currentSource = null;
    }
  };

  const createSourceAndPlay = (offset = 0) => {
    cleanup();

    currentSource = audioContext.createBufferSource();
    currentSource.buffer = audioBuffer;

    // Connect: Source → Filter → Destination
    currentSource.connect(lowPassFilter);
    lowPassFilter.connect(audioContext.destination);

    // Set up event handlers
    currentSource.onended = () => {
      isPlaying = false;
      isPaused = false;
      if (onEndedHandler) {
        onEndedHandler();
      }
    };

    // Resume audio context if suspended
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    try {
      currentSource.start(0, offset);
      isPlaying = true;
      isPaused = false;
      startTime = audioContext.currentTime - offset;
    } catch (error) {
      if (onErrorHandler) {
        onErrorHandler(
          error instanceof Error
            ? error
            : new Error("Failed to start audio playback"),
        );
      }
      throw error;
    }
  };

  const player: FilteredAudioPlayer = {
    play: async () => {
      if (isPlaying && !isPaused) {
        return; // Already playing
      }

      if (isPaused) {
        // Resume from pause
        createSourceAndPlay(pauseTime);
      } else {
        // Start from beginning
        createSourceAndPlay(0);
      }
    },

    pause: () => {
      if (isPlaying && currentSource) {
        pauseTime = audioContext.currentTime - startTime;
        cleanup();
        isPlaying = false;
        isPaused = true;
      }
    },

    stop: () => {
      cleanup();
      isPlaying = false;
      isPaused = false;
      startTime = 0;
      pauseTime = 0;
    },

    get currentTime(): number {
      if (isPlaying && currentSource) {
        return audioContext.currentTime - startTime;
      }
      if (isPaused) {
        return pauseTime;
      }
      return 0;
    },

    get duration(): number {
      return audioBuffer.duration;
    },

    set onended(handler: (() => void) | null) {
      onEndedHandler = handler;
    },

    get onended(): (() => void) | null {
      return onEndedHandler;
    },

    set onerror(handler: ((error: Error) => void) | null) {
      onErrorHandler = handler;
    },

    get onerror(): ((error: Error) => void) | null {
      return onErrorHandler;
    },
  };

  return player;
};

/**
 * Validates that the browser supports the required Web Audio API features
 * @returns boolean - True if Web Audio API with BiquadFilter is supported
 */
export const isAudioFilteringSupported = (): boolean => {
  try {
    const extendedWindow = window as ExtendedWindow;
    const AudioContextCtor =
      window.AudioContext || extendedWindow.webkitAudioContext;

    if (!AudioContextCtor) {
      return false;
    }

    // Test if we can create the required nodes
    const testContext = new AudioContextCtor();
    const testFilter = testContext.createBiquadFilter();

    // Clean up test context
    testContext.close();

    return !!(
      testFilter && typeof testFilter.frequency?.setValueAtTime === "function"
    );
  } catch (error) {
    return false;
  }
};

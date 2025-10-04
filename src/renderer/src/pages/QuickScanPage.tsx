import React, { useState, useEffect } from "react";
import { Progress, Steps, Alert, Select } from "antd";
import {
  PlayCircleOutlined,
  StopOutlined,
  HeartOutlined,
  WifiOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import AudioWaveform from "../components/AudioWaveform";
import useMicrophoneAnalyser from "../hooks/useMicrophoneAnalyser";
import Title from "antd/es/typography/Title";
import "./QuickScan.css";
import "../styles/theme.css";
import HeartDiagram from "@renderer/components/HeartLocationDiagram";

const { Step } = Steps;
const { Option } = Select;
interface HeartArea {
  key: string;
  label: string;
  description: string;
  icon: string;
}

interface SkinBarrier {
  id: string;
  type: "stickers" | "scars" | "fat" | "hair";
  severity: "mild" | "moderate" | "severe";
}

const heartAreas: HeartArea[] = [
  {
    key: "aortic",
    label: "Aortic Valve",
    description: "2nd intercostal space, right sternal border",
    icon: "",
  },
  {
    key: "pulmonary",
    label: "Pulmonary Valve",
    description: "2nd intercostal space, left sternal border",
    icon: "",
  },
  {
    key: "tricuspid",
    label: "Tricuspid Valve",
    description: "4th intercostal space, left sternal border",
    icon: "",
  },
  {
    key: "mitral",
    label: "Mitral Valve",
    description: "5th intercostal space, apex",
    icon: "",
  },
];

function QuickScanPage(): JSX.Element {
  const location = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedHeartArea, setSelectedHeartArea] = useState<string>("");
  const [patientId, setPatientId] = useState<number | null>(null);
  const [completedRecordings, setCompletedRecordings] = useState<
    Record<string, boolean>
  >({ aortic: false, pulmonary: false, tricuspid: false, mitral: false });
  const [recordingResults, setRecordingResults] = useState<Record<string, any>>(
    {},
  );
  const [skinBarriers, setSkinBarriers] = useState<SkinBarrier[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const {
    analyser,
    start: startMicrophone,
    stop: stopMicrophone,
    error: audioError,
    clearError,
  } = useMicrophoneAnalyser();

  // Get patient ID from navigation state if coming from patient select
  useEffect(() => {
    if (location.state?.patientId) {
      setPatientId(location.state.patientId);
    }
  }, [location.state]);

  const steps = [
    {
      title: "Record All Areas",
      description: "Complete recordings for all 4 heart valve areas",
    },
    {
      title: "Comprehensive Analysis",
      description: "AI analyzing all heart sounds together",
    },
    {
      title: "Complete Results",
      description: "View comprehensive heart analysis",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            handleStopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async (): Promise<void> => {
    if (!selectedHeartArea) {
      alert("Please select a heart area to record");
      return;
    }
    if (isRecording) {
      return;
    }

    try {
      clearError();
      console.log("Starting microphone...");
      await startMicrophone();
      console.log("Microphone started, analyser:", analyser);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (microphoneError) {
      console.error("Microphone start failed", microphoneError);
    }
  };

  const handleStopRecording = (): void => {
    stopMicrophone();

    if (!isRecording) {
      setSelectedHeartArea("");
      return;
    }

    setIsRecording(false);

    const currentArea = selectedHeartArea;

    if (!currentArea) {
      setSelectedHeartArea("");
      return;
    }

    // Mark this area as completed and store mock result
    const newCompletedRecordings = {
      ...completedRecordings,
      [currentArea]: true,
    };

    setCompletedRecordings(newCompletedRecordings);

    console.log(selectedHeartArea);

    // Store mock recording result with skin barrier data
    setRecordingResults((prev) => ({
      ...prev,
      [currentArea]: {
        duration: recordingTime,
        heartRate: Math.floor(Math.random() * 20) + 60, // 60-80 BPM
        rhythm: Math.random() > 0.8 ? "Irregular" : "Regular",
        quality: Math.random() > 0.7 ? "Poor" : "Good",
        timestamp: new Date().toISOString(),
        skinBarriers: skinBarriers,
      },
    }));

    // Reset selection for next recording
    // setSelectedHeartArea("");

    // Check if all areas are completed - but don't auto-start analysis
    const allCompleted = Object.values(newCompletedRecordings).every(
      (completed) => completed,
    );

    // Don't automatically start analysis - let user decide when to analyze
    if (allCompleted) {
      setCurrentStep(1);
      // Start comprehensive analysis
      setTimeout(() => {
        setCurrentStep(2);
        setAnalysisComplete(true);
      }, 4000);
    }
  };

  const handleReset = (): void => {
    stopMicrophone();
    setIsRecording(false);
    setRecordingTime(0);
    setCurrentStep(0);
    setAnalysisComplete(false);
    setSelectedHeartArea("");
    setCompletedRecordings({
      aortic: false,
      pulmonary: false,
      tricuspid: false,
      mitral: false,
    });
    setRecordingResults({});
    setSkinBarriers([]);
  };

  const canStartRecording = selectedHeartArea;

  // Auto advance to step 1 when heart area is selected
  useEffect(() => {
    if (
      selectedHeartArea &&
      currentStep === 0 &&
      !isRecording &&
      !analysisComplete
    ) {
      // Stay on step 0 until user manually proceeds
    }
  }, [selectedHeartArea, currentStep, isRecording, analysisComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const scrollToSection = (sectionIndex: number): void => {
    const section = document.getElementById(`section-${sectionIndex}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setCurrentSection(sectionIndex);
    }
  };

  const addSkinBarrier = (): void => {
    // Check if we already have 3 barriers (max: stickers, scars, fat, hair)
    if (skinBarriers.length >= 4) {
      return;
    }

    // Find the first available type
    const existingTypes = skinBarriers.map((barrier) => barrier.type);
    const availableTypes = ["stickers", "scars", "fat", "hair"].filter(
      (type) => !existingTypes.includes(type as any),
    );

    if (availableTypes.length === 0) {
      return; // All types already exist
    }

    const newBarrier: SkinBarrier = {
      id: `barrier-${Date.now()}`,
      type: availableTypes[0] as "stickers" | "scars" | "fat" | "hair",
      severity: "mild",
    };
    setSkinBarriers((prev) => [...prev, newBarrier]);
  };

  const getAvailableTypes = (
    currentBarrierId?: string,
  ): ("stickers" | "scars" | "fat")[] => {
    const existingTypes = skinBarriers
      .filter((barrier) => barrier.id !== currentBarrierId)
      .map((barrier) => barrier.type);
    return ["stickers", "scars", "fat", "hair"].filter(
      (type) => !existingTypes.includes(type),
    );
  };

  const removeSkinBarrier = (id: string): void => {
    setSkinBarriers((prev) => prev.filter((barrier) => barrier.id !== id));
  };

  const updateSkinBarrier = (
    id: string,
    field: "type" | "severity",
    value: string,
  ): void => {
    if (field === "type") {
      // Check if this type is already used by another barrier
      const existingBarrierWithType = skinBarriers.find(
        (barrier) => barrier.id !== id && barrier.type === value,
      );
      if (existingBarrierWithType) {
        return; // Don't allow duplicate types
      }
    }

    setSkinBarriers((prev) =>
      prev.map((barrier) =>
        barrier.id === id ? { ...barrier, [field]: value } : barrier,
      ),
    );
  };

  // Detect current section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [0, 1, 2];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(`section-${i}`);
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentSection(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="quick-scan-container">
      {/* Section 1: Skin Barriers Configuration */}
      <section id="section-0" className="snap-section section-1">
        <GlassCard
          padding="lg"
          className="w-full max-w-3xl max-h-[80vh] flex flex-col"
        >
          <div className="text-center mb-4 flex-shrink-0">
            <Title level={2} style={{ color: "white", margin: 0 }}>
              Skin Barriers Configuration
            </Title>
            <p className="text-white/70 text-sm mt-2">
              Skin barriers are anything that may affect recording quality
              across all heart valve areas
            </p>
            {skinBarriers.length === 0 && (
              <p className="text-white/60 text-sm mt-3">
                No skin barriers configured. Add barriers that may affect
                recording quality.
              </p>
            )}
          </div>

          {/* Scrollable Skin Barriers Container */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Existing Skin Barriers */}
            {skinBarriers.length > 0 && (
              <div className="mb-4 flex-1 min-h-0">
                {/* <h3 className="text-white font-medium text-center mb-4 flex-shrink-0">
                  Active Skin Barriers ({skinBarriers.length})
                </h3> */}
                <div className="max-h-80 space-y-3 px-2 pr-3 skin-barriers-scroll">
                  {skinBarriers.map((barrier, index) => (
                    <div
                      key={barrier.id}
                      className="p-4 rounded-lg bg-white/10 border border-white/20 flex-shrink-0"
                    >
                      <div className="flex items-end gap-4">
                        <div className="flex-1 min-w-0">
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Barrier Type
                          </label>
                          <Select
                            value={barrier.type}
                            onChange={(value) =>
                              updateSkinBarrier(barrier.id, "type", value)
                            }
                            className="w-full"
                            size="large"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                          >
                            {/* Current type is always available */}
                            <Option value={barrier.type}>
                              {barrier.type.charAt(0).toUpperCase() +
                                barrier.type.slice(1)}
                            </Option>
                            {/* Show other available types */}
                            {getAvailableTypes(barrier.id)
                              .filter((type) => type !== barrier.type)
                              .map((type) => (
                                <Option key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Option>
                              ))}
                          </Select>
                        </div>

                        <div className="flex-1 min-w-0">
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Severity Level
                          </label>
                          <Select
                            value={barrier.severity}
                            onChange={(value) =>
                              updateSkinBarrier(barrier.id, "severity", value)
                            }
                            className="w-full"
                            size="large"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                          >
                            <Option value="mild">Mild</Option>
                            <Option value="moderate">Moderate</Option>
                            <Option value="severe">Severe</Option>
                          </Select>
                        </div>

                        <div className="flex-shrink-0">
                          <GlassButton
                            variant="danger"
                            size="sm"
                            icon={<DeleteOutlined />}
                            onClick={() => removeSkinBarrier(barrier.id)}
                          ></GlassButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Barrier */}
            <div className="text-center flex-shrink-0 mb-3 flex flex-col items-center">
              <GlassButton
                variant="secondary"
                icon={<PlusOutlined />}
                onClick={addSkinBarrier}
                disabled={skinBarriers.length >= 4}
              >
                Add Skin Barrier
              </GlassButton>
              {skinBarriers.length >= 4 && (
                <p className="text-white/60 text-sm mt-2">
                  Maximum barriers reached. You have all available barrier types
                  (stickers, scars, fat, hair).
                </p>
              )}
            </div>
          </div>

          <div className="text-center mt-2 flex justify-end">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => scrollToSection(1)}
            >
              Next: Choose Heart Location
            </GlassButton>
          </div>
        </GlassCard>
      </section>

      {/* Section 2: Heart Location Selection */}
      <section id="section-1" className="snap-section section-2">
        <GlassCard padding="lg" className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <Title level={2} style={{ color: "white", margin: 0 }}>
              Choose Heart Location
            </Title>
            <p className="text-white/70 text-sm mt-2">
              Select the heart valve area to record
            </p>
          </div>

          {/* Progress indicator */}
          {/* <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-white/60">Progress:</span>
              <div className="flex gap-2">
                {heartAreas.map((area) => (
                  <div
                    key={area.key}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      completedRecordings[area.key]
                        ? 'bg-green-500 text-white'
                        : selectedHeartArea === area.key
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {completedRecordings[area.key] ? '✓' : area.key.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              <span className="text-white/60">
                {Object.values(completedRecordings).filter(Boolean).length}/4 completed
              </span>
            </div>
          </div> */}

          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center mb-6">
            {/* Interactive Chest Diagram */}
            <div className="relative">
              <HeartDiagram
                selectedHeartArea={selectedHeartArea}
                completedRecordings={completedRecordings}
                onAreaClick={(area) => {
                  // Only allow selection if the area is not already completed
                  if (!completedRecordings[area]) {
                    setSelectedHeartArea(area);
                  }
                }}
              />
            </div>

            {/* Legend and Selection Info */}
            <div className="space-y-3">
              <div className="text-white font-medium text-sm mb-2">
                Heart Valve Areas:
              </div>

              {/* Active Skin Barriers Status */}
              {/* {skinBarriers.length > 0 && (
                <div className="p-3 mb-3 rounded-lg bg-yellow-500/20 border border-yellow-500/40 max-h-32 flex flex-col">
                  <div className="text-yellow-400 text-xs font-medium mb-2 flex-shrink-0">
                    Active Skin Barriers ({skinBarriers.length}):
                  </div>
                  <div className="space-y-1 overflow-y-auto flex-1 skin-barriers-scroll pr-2">
                    {skinBarriers.map((barrier, index) => (
                      <div
                        key={barrier.id}
                        className="text-yellow-300/80 text-xs flex-shrink-0"
                      >
                        {index + 1}. {barrier.severity} {barrier.type}
                      </div>
                    ))}
                  </div>
                  <div className="text-yellow-300/60 text-xs mt-2 flex-shrink-0">
                    Applied to all heart valve recordings
                  </div>
                </div>
              )} */}
              {heartAreas.map((area) => (
                <div
                  key={area.key}
                  className={`p-2 rounded-lg border transition-all duration-300 ${
                    completedRecordings[area.key]
                      ? "bg-green-500/20 border-green-500/40"
                      : selectedHeartArea === area.key
                        ? "bg-white/20 border-white/40 cursor-pointer"
                        : "bg-white/10 border-white/20 cursor-pointer hover:bg-white/15"
                  }`}
                  onClick={() =>
                    !completedRecordings[area.key] &&
                    setSelectedHeartArea(area.key)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${
                        completedRecordings[area.key]
                          ? "bg-green-500 text-white"
                          : selectedHeartArea === area.key
                            ? "bg-purple-500 text-white"
                            : "bg-white/20 text-white/70"
                      }`}
                    >
                      {completedRecordings[area.key]
                        ? "✓"
                        : area.key.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-white font-medium">
                          {area.label}
                        </div>
                        {completedRecordings[area.key] && (
                          <span className="text-green-400 text-xs">
                            Completed
                          </span>
                        )}
                      </div>
                      {/* <div className="text-white/60 text-sm">{area.description}</div> */}
                      {recordingResults[area.key] && (
                        <div className="text-xs text-white/50 mt-1">
                          Duration: {recordingResults[area.key].duration}s
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <GlassButton
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection(0)}
            >
              Back: Skin Barriers
            </GlassButton>
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => scrollToSection(2)}
              disabled={!selectedHeartArea}
            >
              {selectedHeartArea
                ? `Next: Record ${heartAreas.find((area) => area.key === selectedHeartArea)?.label}`
                : "Select Heart Area First"}
            </GlassButton>
          </div>
        </GlassCard>
      </section>

      {/* Section 3: Recording Controls */}
      <section id="section-2" className="snap-section section-3">
        <GlassCard padding="lg" className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <Title level={2} style={{ color: "white", margin: 0 }}>
              Record Heart Sounds
            </Title>
            <p className="text-white/70 text-lg mt-2">
              {selectedHeartArea
                ? `${heartAreas.find((area) => area.key === selectedHeartArea)?.label}`
                : "Ready to record when you select a heart area"}
            </p>
          </div>

          {/* Audio Error Alert */}
          {audioError && (
            <Alert
              type="error"
              showIcon
              closable
              onClose={clearError}
              message="Microphone access required"
              description={audioError}
              className="mb-4 text-left"
            />
          )}

          {/* Recording Visualizer and Timer */}
          <div className="flex flex-col items-center mb-8">
            <div className="recording-visualizer mb-6">
              <div
                style={{
                  border: "1px solid white",
                  minHeight: "180px",
                  width: "520px",
                }}
              >
                <AudioWaveform isActive={isRecording} analyser={analyser} />
              </div>
              {/* Debug info */}
              {/* <div className="text-white text-xs mt-2">
                Debug: isActive={isRecording.toString()}, analyser=
                {analyser ? "exists" : "null"}
              </div> */}
              {/* Fallback display for debugging */}
              {!analyser && !isRecording && (
                <div className="text-white/60 text-sm mt-2">
                  Microphone ready - click record to start
                </div>
              )}
              {!analyser && isRecording && (
                <div className="text-yellow-400 text-sm mt-2">
                  Starting microphone...
                </div>
              )}
            </div>

            <div className="recording-timer text-center mb-6">
              <span className="text-4xl font-mono text-white">
                {formatTime(recordingTime)}
              </span>
              <p className="text-white/60 text-lg mt-2">
                {isRecording ? "Recording..." : "Ready to record"}
              </p>
            </div>

            {recordingTime > 0 && (
              <div className="w-full max-w-md">
                <Progress
                  percent={(recordingTime / 30) * 100}
                  showInfo={false}
                  strokeColor="#8C7DD1"
                  trailColor="rgba(255,255,255,0.2)"
                />
                <p className="text-white/60 text-center mt-2">
                  {30 - recordingTime} seconds remaining
                </p>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="recording-controls text-center mb-8">
            {!isRecording && !analysisComplete && (
              <GlassButton
                variant="primary"
                size="lg"
                icon={<PlayCircleOutlined />}
                onClick={handleStartRecording}
                disabled={
                  !selectedHeartArea || completedRecordings[selectedHeartArea]
                }
                className="mb-4"
              >
                {selectedHeartArea && !completedRecordings[selectedHeartArea]
                  ? `Start Recording`
                  : completedRecordings[selectedHeartArea]
                    ? "Recording Complete"
                    : "Please select a heart area to record"}
              </GlassButton>
            )}

            {isRecording && (
              <GlassButton
                variant="danger"
                size="lg"
                icon={<StopOutlined />}
                onClick={handleStopRecording}
                className="mb-4"
              >
                Stop Recording
              </GlassButton>
            )}

            {Object.values(completedRecordings).filter(Boolean).length === 4 &&
              !analysisComplete && (
                <div className="mb-4">
                  <p className="text-green-400 text-lg mb-4">
                    ✓ All 4 areas recorded!
                  </p>
                  <GlassButton
                    variant="success"
                    size="lg"
                    onClick={() => setCurrentStep(1)}
                    className="mb-4"
                  >
                    Start Comprehensive Analysis
                  </GlassButton>
                </div>
              )}

            {analysisComplete && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h3 className="text-xl font-semibold text-white">
                      Analysis Complete
                    </h3>
                  </div>

                  {/* Display Active Skin Barriers in Results */}
                  {skinBarriers.length > 0 && (
                    <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <div className="text-yellow-400 text-sm font-medium mb-2">
                        Active Skin Barriers:
                      </div>
                      <div className="space-y-1">
                        {skinBarriers.map((barrier, index) => (
                          <div
                            key={barrier.id}
                            className="text-yellow-300/80 text-sm"
                          >
                            {index + 1}. {barrier.severity} {barrier.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-green-400 text-lg">
                    ✓{" "}
                    {Math.random() > 0.7
                      ? "Minor irregularities detected - recommend follow-up"
                      : "Normal heart sounds detected"}
                  </p>
                </div>
                <GlassButton
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                >
                  Start New Recording Session
                </GlassButton>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            {/* <GlassButton
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection(1)}
            >
              Back: Heart Location
            </GlassButton> */}
            {/* <p>{completedRecordings}</p> */}
            {/* {completedRecordings.map((recording, isCompleted) => (
              <div>yo</div>
            ))} */}
            {/* skinBarriers.map((barrier, index) => ( */}
            {completedRecordings[selectedHeartArea] &&
              !Object.values(completedRecordings).every(Boolean) && (
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => scrollToSection(1)}
                >
                  Next: Choose another heart location
                </GlassButton>
              )}

            {!completedRecordings[selectedHeartArea] &&
              !Object.values(completedRecordings).every(Boolean) && (
                <GlassButton
                  variant="secondary"
                  size="lg"
                  onClick={() => scrollToSection(1)}
                >
                  Back: Choose another heart location
                </GlassButton>
              )}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

export default QuickScanPage;

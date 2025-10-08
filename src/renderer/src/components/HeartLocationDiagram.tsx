// HeartDiagram.tsx

import React from "react";
import image from "../assets/chest.png"; // Make sure this path is correct for your project

type HeartArea = "aortic" | "pulmonary" | "tricuspid" | "mitral";

// Define the props the component will accept from its parent
interface HeartDiagramProps {
  selectedHeartArea: string | null;
  completedRecordings: Record<string, boolean>;
  onAreaClick: (area: HeartArea) => void;
}

const HeartDiagram: React.FC<HeartDiagramProps> = ({
  selectedHeartArea,
  completedRecordings,
  onAreaClick,
}) => {
  // This handler now calls the function passed down from the parent component
  const handleAreaClick = (area: HeartArea) => {
    onAreaClick(area);
  };

  return (
    // This container holds both the image and the SVG overlay
    <div style={{ position: "relative", width: "350px" }}>
      {/* Background image */}
      <img
        src={image}
        alt="Chest diagram"
        className="chest-diagram-image"
        style={{ width: "100%", height: "auto" }} // 'auto' maintains aspect ratio
      />

      {/* SVG overlay for interactive circles */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 350 350" // Match the container's coordinate system
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Aortic Area */}
        <g onClick={() => handleAreaClick("aortic")}>
          <circle
            cx="145"
            cy="155"
            r="20"
            fill={
              completedRecordings.aortic
                ? "#10b981"
                : selectedHeartArea === "aortic"
                  ? "#8C7DD1"
                  : "rgba(140, 125, 209, 0.4)"
            }
            stroke={
              completedRecordings.aortic
                ? "#059669"
                : selectedHeartArea === "aortic"
                  ? "#ACACE6"
                  : "#888"
            }
            strokeWidth="2"
            className={
              !completedRecordings.aortic
                ? "cursor-pointer hover:opacity-80"
                : ""
            }
            style={{ transition: "all 0.3s" }}
          />
          <text
            x="145"
            y="161"
            textAnchor="middle"
            className="fill-white text-lg font-bold pointer-events-none select-none"
          >
            {"A"}
          </text>
        </g>

        {/* Pulmonary Area */}
        <g onClick={() => handleAreaClick("pulmonary")}>
          <circle
            cx="200"
            cy="155"
            r="20"
            fill={
              completedRecordings.pulmonary
                ? "#10b981"
                : selectedHeartArea === "pulmonary"
                  ? "#8C7DD1"
                  : "rgba(140, 125, 209, 0.4)"
            }
            stroke={
              completedRecordings.pulmonary
                ? "#059669"
                : selectedHeartArea === "pulmonary"
                  ? "#ACACE6"
                  : "#888"
            }
            strokeWidth="2"
            className={
              !completedRecordings.pulmonary
                ? "cursor-pointer hover:opacity-80"
                : ""
            }
            style={{ transition: "all 0.3s" }}
          />
          <text
            x="200"
            y="161"
            textAnchor="middle"
            className="fill-white text-lg font-bold pointer-events-none select-none"
          >
            {"P"}
          </text>
        </g>

        {/* Tricuspid Area */}
        <g onClick={() => handleAreaClick("tricuspid")}>
          <circle
            cx="193"
            cy="210"
            r="20"
            fill={
              completedRecordings.tricuspid
                ? "#10b981"
                : selectedHeartArea === "tricuspid"
                  ? "#8C7DD1"
                  : "rgba(140, 125, 209, 0.4)"
            }
            stroke={
              completedRecordings.tricuspid
                ? "#059669"
                : selectedHeartArea === "tricuspid"
                  ? "#ACACE6"
                  : "#888"
            }
            strokeWidth="2"
            className={
              !completedRecordings.tricuspid
                ? "cursor-pointer hover:opacity-80"
                : ""
            }
            style={{ transition: "all 0.3s" }}
          />
          <text
            x="193"
            y="216"
            textAnchor="middle"
            className="fill-white text-lg font-bold pointer-events-none select-none"
          >
            {"T"}
          </text>
        </g>

        {/* Mitral Area */}
        <g onClick={() => handleAreaClick("mitral")}>
          <circle
            cx="245"
            cy="255"
            r="22"
            fill={
              completedRecordings.mitral
                ? "#10b981"
                : selectedHeartArea === "mitral"
                  ? "#8C7DD1"
                  : "rgba(140, 125, 209, 0.4)"
            }
            stroke={
              completedRecordings.mitral
                ? "#059669"
                : selectedHeartArea === "mitral"
                  ? "#ACACE6"
                  : "#888"
            }
            strokeWidth="2"
            className={
              !completedRecordings.mitral
                ? "cursor-pointer hover:opacity-80"
                : ""
            }
            style={{ transition: "all 0.3s" }}
          />
          <text
            x="245"
            y="261"
            textAnchor="middle"
            className="fill-white text-lg font-bold pointer-events-none select-none"
          >
            {"M"}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default HeartDiagram;

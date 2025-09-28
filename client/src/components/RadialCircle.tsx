import React from 'react';

interface RadialCircleProps {
  size?: number;     // width & height of SVG
  strokeWidth?: number;
  progress: number;  // 0 to 100
  circleColor?: string;
  fillColor?: string;
  children?: React.ReactNode; // text or elements in center
}

const RadialCircle: React.FC<RadialCircleProps> = ({
  size = 100,
  strokeWidth = 10,
  progress,
  circleColor = "#e6e6e6",
  fillColor = "#680101",
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
      }}
    >
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={circleColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Centered text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none", // allow clicks to pass through
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default RadialCircle;

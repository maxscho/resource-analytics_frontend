import React from "react";
import { EdgeProps, getBezierPath } from "reactflow";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Define the arrow marker */}
      <svg>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6" // Smaller width
            markerHeight="4" // Smaller height
            refX="6" // Adjust reference point for smaller size
            refY="2"
            orient="auto"
          >
            <polygon points="0 0, 6 2, 0 4" fill="#000" />
          </marker>
        </defs>
      </svg>

      {/* Draw the edge path with the arrow marker */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="url(#arrowhead)" // Attach the arrow marker
        style={{ stroke: "#000", strokeWidth: 2 }}
      />

      {/* Render the edge label */}
      {data?.label && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: 12 }}
            startOffset="50%"
            textAnchor="middle"
          >
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
};

export default CustomEdge;
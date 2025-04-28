import React, { useState, memo, useRef } from "react";
import { createPortal } from "react-dom";
import { Handle, NodeProps, Position } from "reactflow";

interface TooltipProps extends NodeProps {
  panelId?: string;
}

const FlowChartTooltip = memo(({ data }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{top: number, left: number}>({top: 0, left: 0});

  const handleMouseEnter = () => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + window.scrollY - 10, // 10px above the node
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div
      ref={nodeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="react-flow__node-default"
      style={{ position: "relative" }}
    >
      <Handle type="target" position={Position.Top} />
      {data?.label || "No Label"}

      {showTooltip &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translate(-50%, -100%)",
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "5px",
              whiteSpace: "nowrap",
              zIndex: 99999,
              minWidth: "150px",
              maxWidth: "300px",
              pointerEvents: "none"
            }}
          >
            <table style={{ color: "white" }}>
              <tbody>
                {[
                  { label: "Case Count", value: data?.case_count ?? "N/A" },
                  { label: "Unique Cases", value: data?.unique_cases ?? "N/A" },
                  { label: "Unique Resources", value: data?.unique_resources ?? "N/A" },
                  { label: "Responsible Role", value: data?.responsible_role ?? "N/A" },
                  { label: "Avg. Duration", value: data?.average_duration ?? "N/A" },
                ].map((row) => (
                  <tr key={row.label}>
                    <td><strong>{row.label}</strong></td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
          document.body
        )
      }

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

FlowChartTooltip.displayName = 'FlowChartTooltip';

export default FlowChartTooltip;
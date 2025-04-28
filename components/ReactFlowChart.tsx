import React, { useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  MarkerType
} from "reactflow";
import { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

import { layoutWithElk } from "@/models/elkLayout";
import CustomEdge from "./CustomEdge";
import FlowChartTooltip from "./FlowChartTooltip";

const nodeTypes = {
  tooltipNode: FlowChartTooltip
}

const edgeTypes = {
  custom: CustomEdge,
};

interface ReactFlowChartProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeSelect: (node: Node) => void;
  panelId: string;
}

function transformBackendData(dfg: { nodes: Node[]; edges: Edge[] }) {
  const nodes = dfg.nodes.map((n) => ({
    id: n.id,
    data: { label: n.data.label },
    type: 'tooltipNode',
    position: { x: 0, y: 0 },
  }));

  const edges = dfg.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'custom', // set the edge type to "custom", otherwise CustomEdge will not be applied
    data: { label: e.label },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }));

  return { nodes, edges };
}

const ReactFlowChart = ({
  initialNodes,
  initialEdges,
  onNodeSelect,
  panelId,
}: ReactFlowChartProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoverDetails, setHoverDetails] = useState<Record<string, any>>({}); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    async function fetchHoverDetails() {
      if (initialNodes.length > 0) {
        try {
          const postResult = await fetch("http://localhost:9090/node_hover_detail", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              panel_id: panelId, // Assuming analysisInstances[0] corresponds to initialNodes[0]?.id
            }),
          });

          const hoverData = await postResult.json();
          setHoverDetails(hoverData);
          console.log("node hover detail", hoverData);
        } catch (error) {
          console.error("Error fetching node hover detail:", error);
        }
      }
    }

    fetchHoverDetails();
  }, [initialNodes]);

  useEffect(() => {
    async function load() {
      const { nodes: rawNodes, edges: rawEdges } = transformBackendData({
        nodes: initialNodes,
        edges: initialEdges,
      });
      const { nodes: layoutedNodes, edges: layoutedEdges } = await layoutWithElk(
        rawNodes,
        rawEdges
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }

    load();
  }, [initialNodes, initialEdges]);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
  };

  // Merge hoverDetails into each node's data
  const nodesWithHoverDetails = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      ...(hoverDetails[node.id] ? hoverDetails[node.id] : {}),
    },
  }));

  return (
    <div style={{ width: "100%", height: "70vh" }}>
      {nodes.length > 0 && (
        <ReactFlow
          nodes={nodesWithHoverDetails}
          edges={edges}
          fitView
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      )}
    </div>
  );
};

export default ReactFlowChart;

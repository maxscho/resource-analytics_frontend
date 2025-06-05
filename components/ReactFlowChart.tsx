import React, { useEffect, useRef, useState } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowInstance,
} from "reactflow";
import { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

import { layoutWithElk } from "@/models/elkLayout";
import CustomEdge from "./CustomEdge";
import FlowChartTooltip from "./FlowChartTooltip";

const nodeTypes = {
  tooltipNode: FlowChartTooltip,
};

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
    type: "tooltipNode",
    position: { x: 0, y: 0 },
  }));

  const edges = dfg.edges.map((e) => {
    const sourceNode = dfg.nodes.find((n) => n.id === e.source);
    const targetNode = dfg.nodes.find((n) => n.id === e.target);

    const sourceY = sourceNode?.position?.y ?? 0;
    const targetY = targetNode?.position?.y ?? 0;

    let sourceHandle = "bottom";
    let targetHandle = "top";

    if (sourceY > targetY) {
      // upward edge
      sourceHandle = "top";
      targetHandle = "bottom";
    }

    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: "custom",
      data: { label: e.label },
      sourceHandle,
      targetHandle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
  });

  return { nodes, edges };
}

function assignUniqueHandles(edges: Edge[]) {
  // Track used handles for each node
  const handlePositions = ["top", "bottom", "left", "right"];
  const nodeHandleCount: Record<string, number> = {};

  return edges.map((edge) => {
    // For source
    nodeHandleCount[edge.source] = (nodeHandleCount[edge.source] || 0) + 1;
    const sourceHandle =
      handlePositions[
        (nodeHandleCount[edge.source] - 1) % handlePositions.length
      ] +
      "-" +
      nodeHandleCount[edge.source];

    // For target
    nodeHandleCount[edge.target] = (nodeHandleCount[edge.target] || 0) + 1;
    const targetHandle =
      handlePositions[
        (nodeHandleCount[edge.target] - 1) % handlePositions.length
      ] +
      "-" +
      nodeHandleCount[edge.target];

    return {
      ...edge,
      sourceHandle,
      targetHandle,
    };
  });
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
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const handleInit = (instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  };

  useEffect(() => {
    async function fetchHoverDetails() {
      if (initialNodes.length > 0 && panelId) {
        console.log("Initial nodes", initialNodes);
        try {
          const postResult = await fetch(
            "http://localhost:9090/node_hover_detail",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                panel_id: panelId,
              }),
            }
          );

          const hoverData = await postResult.json();
          setHoverDetails(hoverData);
        } catch (error) {
          console.error("Error fetching node hover detail:", error);
        }
      }
    }

    fetchHoverDetails();
  }, [initialNodes, panelId]);

  useEffect(() => {
    async function load() {
      const raw = transformBackendData({
        nodes: initialNodes,
        edges: initialEdges,
      });

      // Layout with ELK
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await layoutWithElk(raw.nodes, raw.edges);

      // Use positions to assign handle directions
      const nodeMap = Object.fromEntries(layoutedNodes.map((n) => [n.id, n]));

      // First, assign direction (top/bottom/left/right) based on position
      const edgesWithDirections = layoutedEdges.map((e) => {
        const sourceNode = nodeMap[e.source];
        const targetNode = nodeMap[e.target];

        let sourceHandle = "bottom";
        let targetHandle = "top";

        if (
          sourceNode &&
          targetNode &&
          sourceNode.position.y > targetNode.position.y
        ) {
          // This is an upward edge
          sourceHandle = "top";
          targetHandle = "bottom";
        }

        return {
          ...e,
          sourceHandle,
          targetHandle,
        };
      });

      // Then, make handles unique per node/side, but keep the direction info
      function assignUniqueHandlesBySide(edges: Edge[]) {
        // Track used handles for each node and side
        const handleCount: Record<string, Record<string, number>> = {};

        return edges.map((edge) => {
          // Source
          const srcSide = edge.sourceHandle || "bottom";
          handleCount[edge.source] = handleCount[edge.source] || {};
          handleCount[edge.source][srcSide] =
            (handleCount[edge.source][srcSide] || 0) + 1;
          const sourceHandle = `${srcSide}-${
            handleCount[edge.source][srcSide]
          }`;

          // Target
          const tgtSide = edge.targetHandle || "top";
          handleCount[edge.target] = handleCount[edge.target] || {};
          handleCount[edge.target][tgtSide] =
            (handleCount[edge.target][tgtSide] || 0) + 1;
          const targetHandle = `${tgtSide}-${
            handleCount[edge.target][tgtSide]
          }`;

          return {
            ...edge,
            sourceHandle,
            targetHandle,
          };
        });
      }

      const updatedEdges = assignUniqueHandlesBySide(edgesWithDirections);

      const nodeHandlesMap: Record<string, Set<string>> = {};
      updatedEdges.forEach((edge) => {
        if (!nodeHandlesMap[edge.source]) nodeHandlesMap[edge.source] = new Set();
        if (!nodeHandlesMap[edge.target]) nodeHandlesMap[edge.target] = new Set();
        nodeHandlesMap[edge.source].add(edge.sourceHandle);
        nodeHandlesMap[edge.target].add(edge.targetHandle);
      });

      const nodesWithHandles = layoutedNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          usedHandles: nodeHandlesMap[node.id]
            ? Array.from(nodeHandlesMap[node.id])
            : [],
        },
      }));

      setNodes(nodesWithHandles);
      setEdges(updatedEdges);

      setTimeout(() => {
        const instance = reactFlowInstanceRef.current;
        if (instance) {
          instance.fitView({ padding: 0.1 });
          const bounds = instance.getViewport();
          instance.setViewport(
            { x: bounds.x, y: 0, zoom: bounds.zoom },
            { duration: 500 }
          );
        }
      }, 300);
    }

    load();
  }, [initialNodes, initialEdges]);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
  };

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
          onInit={handleInit}
          fitView
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Controls />
          <MiniMap style={{ height: "50", width: "50" }} pannable zoomable />
        </ReactFlow>
      )}
    </div>
  );
};

export default ReactFlowChart;

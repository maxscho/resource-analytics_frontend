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

const edgeTypes = {
  custom: CustomEdge,
};

interface ReactFlowChartProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeSelect: (node: Node) => void;
}

function transformBackendData(dfg: { nodes: Node[]; edges: Edge[] }) {
  const nodes = dfg.nodes.map((n) => ({
    id: n.id,
    data: { label: n.data.label },
    type: 'default',
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
  onNodeSelect
}: ReactFlowChartProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

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
  }, []);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
    console.log("Node clicked:", node);
  };

  return (
    <div style={{ width: "100%", height: "70vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={handleNodeClick}
        edgeTypes={edgeTypes} // register the custom edge type
      >
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowChart;

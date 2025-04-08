import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Panel,
  MiniMap,
} from "reactflow";
import { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

// @ts-ignore
import ELK from 'elkjs/lib/elk.bundled.js';
import { layoutWithElk } from "@/models/elkLayout";

const elk = new ELK();
const DEFAULT_WIDTH = 30;
const DEFAULT_HEIGHT = 60;

interface ReactFlowChartProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeSelect: (node: Node) => void;
}

function transformBackendData(dfg: { nodes: any[]; edges: any[] }) {
    const nodes = dfg.nodes.map((n) => ({
      id: n.id,
      data: { label: n.label },
      type: 'default',
      position: { x: 0, y: 0 }, // required for React Flow, even if temporary
    }));
  
    const edges = dfg.edges.map((e, i) => ({
      id: `e${i}`,
      source: e.source,
      target: e.target,
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
    const { nodes: rawNodes, edges: rawEdges } =
      transformBackendData({ nodes: initialNodes, edges: initialEdges });
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await layoutWithElk(rawNodes, rawEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }

    load();
  }, []);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
    console.log("Node clicked:", node);
  }

  return (
    <div style={{ width: "100%", height: "70vh" }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView
        onNodeClick={handleNodeClick}
    >
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowChart;

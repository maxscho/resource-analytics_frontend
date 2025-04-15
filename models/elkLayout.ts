// @ts-ignore
import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge, Position } from 'reactflow';

const elk = new ELK();
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 60;

export async function layoutWithElk(
  nodes: Node[],
  edges: Edge[],
  direction: 'DOWN' | 'RIGHT' = 'DOWN'
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const elkNodes = nodes.map((node) => ({
    id: node.id,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  }));

  const elkEdges = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'org.eclipse.elk.layered',
      'elk.direction': direction,
      'elk.spacing.nodeNode': '30',
      'elk.layered.spacing.nodeNodeBetweenLayers': '50',
    },
    children: elkNodes,
    edges: elkEdges,
  };

  const layoutedGraph = await elk.layout(elkGraph);

  const positions = layoutedGraph.children
    ? layoutedGraph.children.reduce((acc, node) => {
        acc[node.id] = { x: node.x || 0, y: node.y || 0 };
        return acc;
      }, {} as Record<string, { x: number; y: number }>)
    : {};

  const positionedNodes = nodes.map((node) => ({
    ...node,
    position: positions[node.id],
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  }));

  return { nodes: positionedNodes, edges };
}
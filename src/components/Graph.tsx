import { useState, useCallback } from "react";
import { ReactFlow, Background, Controls, useReactFlow, type Edge, type Node } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import dagre from "dagre";
import CustomNode from "./CustomNode";
import { AlertTriangle, Settings } from "lucide-react";
import type { CloudGraphData } from "../types/graphData";

type FilterType = 'All' | 'Alerts' | 'Misconfigurations';

const edgeColors: Record<string, string> = {
    cloud: "#3B82F6",   // blue
    aws: "#F97316",     // orange
    gcp: "#22C55E",     // green
    saas: "#A855F7",    // purple
    service: "#6B7280", // gray
    database: "#FBBF24", // yellow
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 160;
const nodeHeight = 80;

/**
 * Arranges the given nodes and edges using the Dagre layout algorithm.
 *
 * This function sets up the Dagre graph with the specified direction (`rankdir`),
 * node separation (`nodesep`), and rank separation (`ranksep`). It then adds all nodes
 * and edges to the Dagre graph, computes their positions, and updates each node's
 * `position` property accordingly.
 */
function layout(nodes: Node[], edges: Edge[], direction = "LR") {
    dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 80 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const pos = dagreGraph.node(node.id);
        node.position = { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 };
    });

    return { nodes, edges };
}

const nodeTypes = { custom: CustomNode };

export default function Graph({ graphData }: { graphData: CloudGraphData }) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const { fitView } = useReactFlow();

    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    // Filter visible nodes & edges depending on collapsed state and activeFilter
    const getVisibleGraph = useCallback(() => {
        let visibleNodes: Node[] = [];
        let visibleEdges: Edge[] = [];

        // Helper to check if node passes filter
        function passesFilter(node: typeof graphData.nodes[0]) {
            if (activeFilter === 'Alerts') {
                return node.alerts >= 1;
            }
            if (activeFilter === 'Misconfigurations') {
                return node.misconfigs >= 1;
            }
            return true;
        }

        function addNode(id: string) {
            const n = graphData.nodes.find((x) => x.id === id);
            if (!n || !passesFilter(n)) return;
            visibleNodes.push({
                id: n.id,
                // Render using our custom node
                type: "custom",
                data: { ...n, collapsed: collapsed[n.id] ?? false },
                position: { x: 0, y: 0 },

            });

            if (!(collapsed[n.id] ?? false) && n.children) {
                n.children.forEach((childId) => {
                    const childNode = graphData.nodes.find((x) => x.id === childId);
                    if (childNode && passesFilter(childNode)) {
                        // style the edge based on child node type
                        visibleEdges.push({ id: `${n.id}-${childId}`, source: n.id, target: childId, animated: true, style: { stroke: edgeColors[childNode.type], strokeWidth: 2 } });
                        addNode(childId);
                    }
                });
            }
        }

        // Add all root nodes (nodes without any parent)
        const childIds = new Set(graphData.nodes.flatMap(n => n.children ?? []));
        graphData.nodes
            .filter(n => !childIds.has(n.id))
            .forEach(rootNode => addNode(rootNode.id));

        return layout(visibleNodes, visibleEdges, "LR");
    }, [collapsed, activeFilter]);

    const { nodes, edges } = getVisibleGraph();

    // Toggle collapse
    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        if (graphData.nodes.find((n) => n.id === node.id)?.children) {
            setCollapsed((prev) => {
                // After expanding/collapsing, auto-fit the view to show all nodes
                setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 300);
                return { ...prev, [node.id]: !prev[node.id] }
            });
        }
    }, []);

    return (
        <div style={{ height: "100vh" }}>
            {/* Filtering */}
            <div className="flex items-center gap-3 bg-white p-2 shadow absolute top-4 left-10 border-1 border-gray-200 z-10 rounded">
                {['All', 'Alerts', 'Misconfigurations'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter as FilterType)}
                        className={`px-3 cursor-pointer py-1 text-sm font-medium rounded border-1 border-gray-200 ${activeFilter === filter
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        {filter === 'Alerts' && <AlertTriangle className="inline w-4 h-4 mr-1" />}
                        {filter === 'Misconfigurations' && <Settings className="inline w-4 h-4 mr-1" />}
                        {filter}
                    </button>
                ))}
            </div>
            {/* React Flow Graph */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                onNodeClick={onNodeClick}

            >
                <Background />
                {/* showing controls like zoom in/out and fit view */}
                <Controls position="top-right" orientation="horizontal" style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#155DFB' }} />
            </ReactFlow>
        </div>
    );
}


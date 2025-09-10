import { useState, useCallback } from "react";
import { ReactFlow, Background, Controls, useReactFlow, type Edge, type Node } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import dagre from "dagre";
import CustomNode from "./CustomNode";
import { AlertTriangle, Settings } from "lucide-react";

const rawData = {
    nodes: [
        { id: "cloud", label: "Cloud", type: "cloud", alerts: 253, misconfigs: 18, children: ["aws1", "aws2", "gcp", "saas"] },
        { id: "aws1", label: "AWS 1", type: "aws", alerts: 84, misconfigs: 3, children: ["s3"] },
        { id: "aws2", label: "AWS 2", type: "aws", alerts: 124, misconfigs: 4, children: ["rds"] },
        { id: "gcp", label: "GCP", type: "gcp", alerts: 28, misconfigs: 9 },
        { id: "saas", label: "SaaS", type: "saas", alerts: 123, misconfigs: 5 },
        { id: "s3", label: "S3", type: "service", alerts: 66, misconfigs: 3 },
        { id: "lambda", label: "Lambda", type: "service", alerts: 66, misconfigs: 3 },
        { id: "dynamo", label: "DynamoDB", type: "database", alerts: 0, misconfigs: 1 },
        { id: "rds", label: "RDS", type: "service", alerts: 68, misconfigs: 3, children: ["lambda", "dynamo"] }
    ],
    edges: [
        { source: "cloud", target: "aws1" },
        { source: "cloud", target: "aws2" },
        { source: "cloud", target: "gcp" },
        { source: "cloud", target: "saas" },
        { source: "aws1", target: "s3" },
        { source: "aws2", target: "rds" }
    ]
};

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

function layout(nodes: Node[], edges: Edge[], direction = "LR") {
    const isHorizontal = direction === "LR";
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

export default function Graph() {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const { fitView } = useReactFlow();

    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    // Filter visible nodes & edges depending on collapsed state and activeFilter
    const getVisibleGraph = useCallback(() => {
        let visibleNodes: Node[] = [];
        let visibleEdges: Edge[] = [];

        // Helper to check if node passes filter
        function passesFilter(node: typeof rawData.nodes[0]) {
            if (activeFilter === 'Alerts') {
                return node.alerts >= 1;
            }
            if (activeFilter === 'Misconfigurations') {
                return node.misconfigs >= 1;
            }
            return true;
        }

        function addNode(id: string) {
            const n = rawData.nodes.find((x) => x.id === id);
            if (!n || !passesFilter(n)) return;
            visibleNodes.push({
                id: n.id,
                type: "custom",
                // style: { stroke: edgeColors[n.type], strokeWidth: 2 },
                data: { ...n, collapsed: collapsed[n.id] ?? false },
                position: { x: 0, y: 0 },

            });

            if (!(collapsed[n.id] ?? false) && n.children) {
                n.children.forEach((childId) => {
                    const childNode = rawData.nodes.find((x) => x.id === childId);
                    if (childNode && passesFilter(childNode)) {
                        visibleEdges.push({ id: `${n.id}-${childId}`, source: n.id, target: childId, animated: true, style: { stroke: edgeColors[childNode.type], strokeWidth: 2 } });
                        addNode(childId);
                    }
                });
            }
        }

        addNode("cloud");
        return layout(visibleNodes, visibleEdges, "LR");
    }, [collapsed, activeFilter]);

    const { nodes, edges } = getVisibleGraph();

    // Toggle collapse
    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        if (rawData.nodes.find((n) => n.id === node.id)?.children) {
            setCollapsed((prev) => {
                setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 300);
                return { ...prev, [node.id]: !prev[node.id] }
            });
        }
    }, []);

    return (
        <div style={{ height: "100vh" }}>
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
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                onNodeClick={onNodeClick}

            >
                <Background />
                <Controls position="top-right" orientation="horizontal" style={{ background: 'white', padding: '8px', borderRadius: '4px', color: '#155DFB' }} />
            </ReactFlow>
        </div>
    );
}


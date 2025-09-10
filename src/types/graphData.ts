export interface CloudGraphData {
    nodes: NodesItem[];
    edges: EdgesItem[];
}
interface NodesItem {
    id: string;
    label: string;
    type: string;
    alerts: number;
    misconfigs: number;
    children?: string[];
}
interface EdgesItem {
    source: string;
    target: string;
}
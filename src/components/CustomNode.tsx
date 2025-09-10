/**
 * Component used to render a custom node in our graph for a react-flow diagram, it displays an icon and color
 * based on the node type, along with badges for alerts and misconfigurations.
 * The component also includes handles for connecting edges in the diagram.
 *
 * @param data - The node data containing type, label, alerts, and misconfigs.
 * @returns A styled node element with icon, badges, label, and edge handles.
 */
import { Handle, Position } from "@xyflow/react";
import { AlertTriangle, Box, Cloud, Database, Filter, Server } from "lucide-react";
import clsx from "clsx";


const typeColors: Record<string, string> = {
    cloud: "bg-blue-400",
    aws: "bg-orange-400",
    gcp: "bg-green-500",
    saas: "bg-purple-500",
    service: "bg-gray-400",
    database: "bg-yellow-400",
};


type NodeData = {
    type: string; label?: string; alerts?: number; misconfigs?: number
};

export default function CustomNode({ data }: { data: NodeData }) {
    const colorClass = typeColors[data.type] || "bg-gray-300";

    const getIcon = () => {
        switch (data.type) {
            case "cloud":
                return <Cloud size={24} />;
            case "saas":
                return <Box size={24} />;
            case "aws":
                return <Server size={24} />;
            case "gcp":
                return <Cloud size={24} />;
            case "rds":
                return <Database size={24} />;
            case "service":
                return <Server size={24} />;
            default:
                return <Box size={24} />;
        }
    };

    return (
        <div className="relative flex flex-col items-center">
            {/* === Badges above circle === */}
            <div className="flex gap-1 absolute -top-7 transition-all">
                <div className="flex items-center gap-1 rounded-2 border-1 border-gray-200 px-2 py-0.5 text-xs text-black-600 font-semibold shadow">
                    <AlertTriangle size={12} color="#C74137" /> {data.alerts}
                </div>
                <div className="flex items-center gap-1 rounded-2 border-1 border-gray-200 px-2 py-0.5 text-xs text-black-600 font-semibold shadow">
                    <Filter size={12} color="#C74137" /> {data.misconfigs}
                </div>
            </div>

            {/* === Circle with background color + text === */}
            <div
                className={clsx(
                    "transition-all w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition",
                    colorClass
                )}
            >
                <div className="flex flex-col items-center">
                    {getIcon()}
                </div>
            </div>
            <span className="absolute -bottom-7 text-sm font-semibold">{data.label}</span>

            {/* === Handles for edges === */}
            <Handle type="target" position={Position.Left} className="!bg-gray-500" />
            <Handle type="source" position={Position.Right} className="!bg-gray-500" />
        </div>
    );
}

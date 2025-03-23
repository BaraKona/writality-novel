import { memo } from "react";
import { type EdgeProps, getBezierPath, EdgeLabelRenderer } from "reactflow";
import { Badge } from "@renderer/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";

interface RelationshipEdgeData {
  type: string;
  description?: string;
}

const relationshipColors: Record<string, string> = {
  friend: "bg-green-500",
  family: "bg-blue-500",
  romantic: "bg-pink-500",
  rival: "bg-orange-500",
  mentor: "bg-purple-500",
  enemy: "bg-red-500",
  colleague: "bg-cyan-500",
  other: "bg-gray-500",
};

function RelationshipEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<RelationshipEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationshipType = data?.type || "other";
  const colorClass = relationshipColors[relationshipType] || "bg-gray-500";

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path stroke-2"
        d={edgePath}
        strokeWidth={2}
        stroke={colorClass.replace("bg-", "stroke-").replace("-500", "-400")}
      />

      <EdgeLabelRenderer>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                style={{
                  position: "absolute",
                  transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                  pointerEvents: "all",
                }}
                className="nodrag nopan"
              >
                <Badge
                  className={`${colorClass} text-white text-xs px-2 py-0.5 capitalize`}
                >
                  {relationshipType}
                </Badge>
              </div>
            </TooltipTrigger>
            {data?.description && (
              <TooltipContent>
                <p className="max-w-xs text-sm">{data.description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(RelationshipEdge);

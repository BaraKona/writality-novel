import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { User } from "lucide-react";

interface CharacterNodeData {
  name: string;
  description: string;
  image: string;
}

function CharacterNode({
  data,
  isConnectable,
}: NodeProps<CharacterNodeData>): JSX.Element {
  return (
    <Card className="w-48 shadow-md border-2 hover:border-primary transition-colors">
      <CardHeader className="p-3 pb-0 flex justify-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={data.image} alt={data.name} />
          <AvatarFallback className="bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="p-3 text-center">
        <h3 className="font-bold text-sm truncate">{data.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-3 mt-1">
          {data.description || "No description"}
        </p>
      </CardContent>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
    </Card>
  );
}

export default memo(CharacterNode);

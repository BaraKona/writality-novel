"use client";

import type React from "react";
import { User, FileText } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { Card, CardContent } from "@renderer/components/ui/card";

export default function NodeList(): JSX.Element {
  const onDragStart = (event: React.DragEvent, nodeType: string): void => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col gap-1">
      <Card
        className="cursor-grab hover:border-foreground/20"
        draggable
        onDragStart={(event) => onDragStart(event, "characterNode")}
      >
        <CardContent className="p-3 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <h3 className="font-medium text-sm truncate">Character</h3>
            <p className="text-xs text-muted-foreground truncate">
              Drag to add a character
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="">
        <Card
          className="cursor-grab hover:border-foreground/20 bg-muted/50"
          draggable
          onDragStart={(event) => onDragStart(event, "contentNode")}
        >
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Content</h3>
              <p className="text-xs text-muted-foreground">
                Drag to add content
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

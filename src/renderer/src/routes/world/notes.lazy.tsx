import { createLazyFileRoute } from "@tanstack/react-router";

import type React from "react";

import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type EdgeTypes,
  type OnConnectStartParams,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@renderer/components/ui/button";
import { Label } from "@renderer/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@renderer/components/ui/dialogue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { Users } from "lucide-react";
import CharacterNode from "@renderer/components/flows/nodes/CharacterNode";
import ContentNode from "@renderer/components/flows/nodes/ContentNode";
import RelationshipEdge from "@renderer/components/flows/edges/relationshipEdge";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import NodeList from "@renderer/components/flows/NodeList";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = {
  characterNode: CharacterNode,
  contentNode: ContentNode,
};

const edgeTypes: EdgeTypes = {
  relationshipEdge: RelationshipEdge,
};

export const Route = createLazyFileRoute("/world/notes")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [relationshipType, setRelationshipType] = useState("friend");
  const [relationshipDescription, setRelationshipDescription] = useState("");
  const [isRelationshipDialogOpen, setIsRelationshipDialogOpen] =
    useState(false);
  const [connectionParams, setConnectionParams] = useState<Connection | null>(
    null,
  );
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [characters, setCharacters] = useState<
    Array<{ id: string; name: string; description: string }>
  >([]);

  // Add a character to the sidebar list
  const addCharacterToList = useCallback(() => {
    if (!characterName.trim()) return;

    const newCharacter = {
      id: `character-${Date.now()}`,
      name: characterName,
      description: characterDescription,
    };

    setCharacters((prev) => [...prev, newCharacter]);
    setCharacterName("");
    setCharacterDescription("");
  }, [characterName, characterDescription]);

  // Add a content node to the canvas
  const addContentNode = useCallback(() => {
    if (!contentTitle.trim()) return;

    const position = reactFlowInstance?.project({
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    }) || { x: 100, y: 100 };

    const newNode = {
      id: `content-${Date.now()}`,
      type: "contentNode",
      position,
      data: {
        title: contentTitle,
        content: contentText,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setContentTitle("");
    setContentText("");
  }, [contentTitle, contentText, reactFlowInstance, setNodes]);

  // Handle connection start
  const onConnectStart = useCallback(
    (_: React.MouseEvent, { nodeId, handleType }: OnConnectStartParams) => {
      // Check if the source node is a content node (these shouldn't have connections)
      const node = nodes.find((n) => n.id === nodeId);
      if (node?.type === "contentNode") {
        return false;
      }
    },
    [nodes],
  );

  // Handle connection
  const onConnect = useCallback(
    (params: Connection) => {
      // Check if either source or target is a content node
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (
        sourceNode?.type === "contentNode" ||
        targetNode?.type === "contentNode"
      ) {
        return; // Don't allow connections to/from content nodes
      }

      // Store connection params and open the relationship dialog
      setConnectionParams(params);
      setIsRelationshipDialogOpen(true);
    },
    [nodes],
  );

  // Create the relationship edge after dialog confirmation
  const createRelationship = useCallback(() => {
    if (connectionParams?.source && connectionParams?.target) {
      const newEdge = {
        id: `e${connectionParams.source}-${connectionParams.target}`,
        source: connectionParams.source,
        target: connectionParams.target,
        type: "relationshipEdge",
        data: {
          type: relationshipType,
          description: relationshipDescription,
        },
        animated: true,
      };

      setEdges((eds) => addEdge(newEdge, eds));
      setRelationshipType("friend");
      setRelationshipDescription("");
      setConnectionParams(null);
      setIsRelationshipDialogOpen(false);
    }
  }, [connectionParams, relationshipType, relationshipDescription, setEdges]);

  // Handle dropping a node from the sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow/type");
      const characterData = event.dataTransfer.getData(
        "application/reactflow/character",
      );

      if (typeof type === "undefined" || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {},
      };

      if (type === "characterNode" && characterData) {
        const character = JSON.parse(characterData);
        newNode = {
          ...newNode,
          data: {
            name: character.name,
            description: character.description,
            image: `/placeholder.svg?height=100&width=100`,
          },
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const editor = useCreateEditor({ value: "" });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background flex flex-col">
        <div className="p-4 py-4.5 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Story Elements
          </h2>
        </div>
        <div className="flex-1 overflow-auto p-2">
          <NodeList />
        </div>
      </div>

      {/* Main Flow Area */}
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4 bg-background">
          <h1 className="text-2xl font-bold">Character Relationship Flow</h1>
        </header>

        <div
          className="flex-1"
          ref={reactFlowWrapper}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnectStart={onConnectStart}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background />
          </ReactFlow>
        </div>
      </div>

      {/* Relationship Dialog */}
      <Dialog
        open={isRelationshipDialogOpen}
        onOpenChange={setIsRelationshipDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Define Relationship</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Relationship Type</Label>
              <Select
                value={relationshipType}
                onValueChange={setRelationshipType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="rival">Rival</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="enemy">Enemy</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="relationshipDescription">Description</Label>
              {/* <Textarea
                id="relationshipDescription"
                value={relationshipDescription}
                onChange={(e) => setRelationshipDescription(e.target.value)}
                placeholder="Describe the relationship"
                rows={3}
              /> */}
              <BasicEditor
                editor={editor}
                setContent={(value) => setRelationshipDescription(value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRelationshipDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={createRelationship}>Create Relationship</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

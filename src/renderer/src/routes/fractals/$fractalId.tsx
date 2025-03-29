import { createFileRoute } from "@tanstack/react-router";

import type React from "react";

import { useState, useCallback, useRef, useEffect } from "react";
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
  type ReactFlowInstance,
  MarkerType,
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
import { Blocks } from "lucide-react";
import CharacterNode from "@renderer/components/flows/nodes/CharacterNode";
import NoteNode from "@renderer/components/flows/nodes/NoteNode";
import RelationshipEdge from "@renderer/components/flows/edges/relationshipEdge";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import NodeList from "@renderer/components/flows/NodeList";
import { useFractal } from "@renderer/hooks/fractal/useFractal";
import { useSaveFractalState } from "@renderer/hooks/fractal/useSaveFractalState";
import { useUpdateFractal } from "@renderer/hooks/fractal/useUpdateFractal";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { toast } from "sonner";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = {
  characterNode: CharacterNode,
  contentNode: NoteNode,
};

const edgeTypes: EdgeTypes = {
  relationshipEdge: RelationshipEdge,
};

export const Route = createFileRoute("/fractals/$fractalId")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [relationshipType, setRelationshipType] = useState("friend");
  const [relationshipDescription, setRelationshipDescription] = useState("");
  const [isRelationshipDialogOpen, setIsRelationshipDialogOpen] =
    useState(false);
  const [connectionParams, setConnectionParams] = useState<Connection | null>(
    null,
  );
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const { fractalId } = Route.useParams();
  const { data: fractal, isLoading } = useFractal(Number(fractalId));
  const { mutate: saveFractalState } = useSaveFractalState(Number(fractalId));
  const { mutate: updateFractal } = useUpdateFractal(Number(fractalId));

  const debouncedSave = useDebounce(() => {
    if (fractal?.id) {
      saveFractalState({ nodes, edges });
    }
  }, 1000);

  // Reset nodes and edges when fractalId changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [fractalId]);

  // Load saved fractal state
  useEffect(() => {
    if (fractal?.description) {
      try {
        const savedState = fractal.description as {
          nodes?: Node[];
          edges?: Edge[];
        };
        if (savedState.nodes) {
          setNodes(savedState.nodes);
        }
        if (savedState.edges) {
          setEdges(savedState.edges);
        }
      } catch (error) {
        console.error("Failed to load fractal state:", error);
      }
    }
  }, [fractal?.description, setNodes, setEdges]);

  // Save fractal state when nodes or edges change
  useEffect(() => {
    debouncedSave();
  }, [nodes, edges]);

  // Handle connection start
  const onConnectStart = useCallback(
    (_: React.MouseEvent, { nodeId }: OnConnectStartParams) => {
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

      // Check if a connection already exists in the same direction
      const existingConnection = edges.find(
        (edge) =>
          edge.source === params.source && edge.target === params.target,
      );

      if (existingConnection) {
        toast.error("Relationship already established in this direction");
        return; // Don't allow duplicate connections in the same direction
      }

      // Store connection params and open the relationship dialog
      setConnectionParams(params);
      setIsRelationshipDialogOpen(true);
    },
    [nodes, edges],
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
          subject: connectionParams.source,
          object: connectionParams.target,
        },
        animated: true,
        markerEnd: {
          type: MarkerType.Arrow,
          color: "#b1b1b7",
          width: 20,
          height: 20,
        },
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

      if (type === "characterNode") {
        newNode = {
          ...newNode,
          data: {
            name: "Select Character",
            description: "Click to select a character",
            image: `/placeholder.svg?height=100&width=100`,
          },
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const editor = useCreateEditor({ value: "" });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!fractal) {
    return <div>Fractal not found</div>;
  }

  return (
    <div className="flex h-screen relative">
      <div className="absolute left-0 top-0 bottom-0 my-auto p-2 pt-1 py-2">
        <div className="w-64 bg-background h-full flex flex-col z-10 relative border rounded-lg shadow">
          <div className="p-4 py-2 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Blocks className="h-5 w-5" />
              Story Elements
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <NodeList />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b bg-background pl-68">
          <h2
            className="text-2xl font-bold"
            contentEditable
            dangerouslySetInnerHTML={{ __html: fractal.name }}
            onBlur={(e) => {
              if (fractal?.id) {
                updateFractal({ name: e.target.innerText });
              }
            }}
          />
        </div>

        <div
          className="flex-1"
          ref={reactFlowWrapper}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(nodes) => onNodesChange(nodes)}
            onEdgesChange={(edges) => onEdgesChange(edges)}
            onConnectStart={(event, params) =>
              onConnectStart(event as React.MouseEvent, params)
            }
            onConnect={(connection) => onConnect(connection)}
            onInit={(instance) => setReactFlowInstance(instance)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls position="top-right" />
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

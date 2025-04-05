import { useEffect, useRef, useCallback, memo, useState } from "react";
import * as d3 from "d3-force";
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import { type SimulationNodeDatum, type SimulationLinkDatum } from "d3-force";
import { type D3DragEvent } from "d3-drag";
import { type Selection, type BaseType } from "d3-selection";
import { Loader2, X } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  cn,
  getRelationshipTypeColor,
  getFactionColor,
} from "@renderer/lib/utils";
import { Value } from "@udecode/plate";
import {
  charactersTable,
  fractalCharacterRelationshipsTable,
} from "@db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFractals } from "@renderer/hooks/fractal/useFractals";

interface CharacterGraphProps {
  onCharacterSelect: (characterId: number) => void;
  selectedFractalId: number | null;
  isLoading: boolean;
  data: {
    character: typeof charactersTable.$inferSelect & {
      description: Value;
    };
    fractal_character_relationships: (typeof fractalCharacterRelationshipsTable.$inferSelect)[];
  }[];
}

interface NodeData extends SimulationNodeDatum {
  id: number;
  name: string;
  type: string;
  age?: number;
  faction?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkData extends SimulationLinkDatum<NodeData> {
  source: NodeData;
  target: NodeData;
  type: string;
}

interface RelationshipInfo {
  sourceName: string;
  targetName: string;
  subjectType: string;
  objectType: string;
  hasSubjectRelationship: boolean;
  hasObjectRelationship: boolean;
  direction: "subject" | "object";
  showBothDirections: boolean;
}

export const CharacterGraph = memo(function CharacterGraph({
  onCharacterSelect,
  data,
  isLoading,
}: CharacterGraphProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);
  const [relationshipInfo, setRelationshipInfo] =
    useState<RelationshipInfo | null>(null);
  const [selectedFractalId, setSelectedFractalId] = useState<number | null>(
    null,
  );
  const { data: fractals } = useFractals();
  const handleCharacterSelect = useCallback(
    (characterId: number) => {
      onCharacterSelect(characterId);
    },
    [onCharacterSelect],
  );

  const setupVisualization = useCallback(() => {
    if (!svgRef.current || !data || !containerRef.current) return;

    // Get container dimensions
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const svg = d3Selection.select(svgRef.current);

    // Set SVG dimensions to match container
    svg.attr("width", width).attr("height", height);

    // Clear any existing content
    svg.selectAll("*").remove();

    // Create nodes and links from the data
    const nodeMap = new Map<number, NodeData>();

    // First pass: create nodes for all character
    data.forEach((item) => {
      // Add subject character node
      if (!nodeMap.has(item.character.id)) {
        nodeMap.set(item.character.id, {
          id: item.character.id,
          name: item.character.name,
          type: item.fractal_character_relationships[0]?.relationship_type,
          age: item.character.age ?? undefined,
          faction: item.character.faction ?? undefined,
        });
      }

      // Add object character nodes from relationships
      item.fractal_character_relationships.forEach((relationship) => {
        // Add object character node if it's a subject relationship
        if (
          relationship.subject_character_id === item.character.id &&
          !nodeMap.has(relationship.object_character_id)
        ) {
          const objectCharacter = data.find(
            (d) => d.character.id === relationship.object_character_id,
          );
          if (objectCharacter) {
            nodeMap.set(relationship.object_character_id, {
              id: objectCharacter.character.id,
              name: objectCharacter.character.name,
              type: objectCharacter.fractal_character_relationships[0]
                ?.relationship_type,
              age: objectCharacter.character.age ?? undefined,
              faction: objectCharacter.character.faction ?? undefined,
            });
          }
        }

        // Add subject character node if it's an object relationship
        if (
          relationship.object_character_id === item.character.id &&
          !nodeMap.has(relationship.subject_character_id)
        ) {
          const subjectCharacter = data.find(
            (d) => d.character.id === relationship.subject_character_id,
          );
          if (subjectCharacter) {
            nodeMap.set(relationship.subject_character_id, {
              id: subjectCharacter.character.id,
              name: subjectCharacter.character.name,
              type: subjectCharacter.fractal_character_relationships[0]
                ?.relationship_type,
              age: subjectCharacter.character.age ?? undefined,
              faction: subjectCharacter.character.faction ?? undefined,
            });
          }
        }
      });
    });

    const nodes = Array.from(nodeMap.values());

    // Create links for valid relationships
    const links: LinkData[] = data.flatMap((item) => {
      const links: LinkData[] = [];

      // Process all relationships for this character
      item.fractal_character_relationships.forEach((relationship) => {
        // Case 1: Current character is the subject
        if (relationship.subject_character_id === item.character.id) {
          const sourceNode = nodeMap.get(item.character.id);
          const targetNode = nodeMap.get(relationship.object_character_id);
          if (sourceNode && targetNode) {
            links.push({
              source: sourceNode,
              target: targetNode,
              type: relationship.relationship_type,
            });
          }
        }

        // Case 2: Current character is the object
        if (relationship.object_character_id === item.character.id) {
          const sourceNode = nodeMap.get(relationship.subject_character_id);
          const targetNode = nodeMap.get(item.character.id);
          if (sourceNode && targetNode) {
            links.push({
              source: sourceNode,
              target: targetNode,
              type: relationship.relationship_type,
            });
          }
        }
      });

      return links;
    });

    // Create the simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => (d as NodeData).id)
          .distance(100)
          .strength(0.7),
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      .force("collision", d3.forceCollide().radius(40))
      .force("x", d3.forceX(width / 2).strength(0.3))
      .force("y", d3.forceY(height / 2).strength(0.3));

    // Store simulation reference
    simulationRef.current = simulation;

    // Create the SVG elements
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .attr("data-type", (d: LinkData) => d.type)
      .attr("cursor", "pointer")
      .on("mouseover", function () {
        // Darken the edge on hover
        d3Selection
          .select(this)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        // Reset edge style on mouseout
        d3Selection
          .select(this)
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 1);
      })
      .on("click", function (_, d: LinkData) {
        // Show relationship info on click
        const relationshipType =
          d.type.charAt(0).toUpperCase() + d.type.slice(1);

        // Find the reverse relationship type if it exists
        let reverseType = relationshipType;
        let hasReverseRelationship = false;

        // Look for a reverse relationship in the data
        if (data) {
          const reverseRelationship = data.find(
            (item) =>
              item.character.id === d.target.id &&
              item.fractal_character_relationships.some(
                (rel) =>
                  rel.subject_character_id === d.target.id &&
                  rel.object_character_id === d.source.id,
              ),
          );

          if (reverseRelationship) {
            const reverseRel =
              reverseRelationship.fractal_character_relationships.find(
                (rel) =>
                  rel.subject_character_id === d.target.id &&
                  rel.object_character_id === d.source.id,
              );

            if (reverseRel) {
              reverseType =
                reverseRel.relationship_type.charAt(0).toUpperCase() +
                reverseRel.relationship_type.slice(1);
              hasReverseRelationship = true;
            }
          }
        }

        // Determine if the current character is the subject or object
        // We'll use the source as the subject and target as the object
        setRelationshipInfo({
          sourceName: d.source.name,
          targetName: d.target.name,
          subjectType: relationshipType,
          objectType: reverseType,
          hasSubjectRelationship: true,
          hasObjectRelationship: hasReverseRelationship,
          direction: "subject",
          showBothDirections: true,
        });
      });

    const node = svg.append("g").selectAll("g").data(nodes).join("g");

    // Add drag behavior
    const drag = d3Drag
      .drag<SVGGElement, NodeData>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    node.call(
      drag as unknown as (
        selection: Selection<
          BaseType | SVGGElement,
          NodeData,
          SVGGElement,
          unknown
        >,
      ) => void,
    );

    // Add circles to nodes
    node
      .append("circle")
      .attr("stroke", "hsl(var(--sidebar-primary))")
      .attr("stroke-width", 1)
      .attr("r", (d) => {
        // Default size is 10, scale up based on age
        const baseSize = 10;
        const age = d.age ?? 0;
        // Scale factor: 1 + (age/100) to make it reasonable
        // Add a maximum size of 40 to prevent extremely large nodes
        const calculatedSize = baseSize * (1 + age / 100);
        return Math.min(calculatedSize, 80);
      })
      .attr("fill", (d) => getFactionColor(d.faction));

    // Add labels to nodes
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--sidebar-primary))")
      .attr("font-size", "12px");

    // Add click handler to nodes
    node.on("click", (event, d) => {
      handleCharacterSelect(d.id);
    });

    // Update positions on each tick
    simulation.on("tick", () => {
      // Keep nodes within bounds
      nodes.forEach((node) => {
        node.x = Math.max(50, Math.min(width - 50, node.x ?? 0));
        node.y = Math.max(50, Math.min(height - 50, node.y ?? 0));
      });

      link
        .attr("x1", (d) => d.source.x ?? 0)
        .attr("y1", (d) => d.source.y ?? 0)
        .attr("x2", (d) => d.target.x ?? 0)
        .attr("y2", (d) => d.target.y ?? 0);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Drag functions
    function dragstarted(
      event: D3DragEvent<SVGGElement, NodeData, unknown>,
    ): void {
      if (!event.active) simulation.alphaTarget(0.2).restart();
      const d = event.subject as NodeData;
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: D3DragEvent<SVGGElement, NodeData, unknown>): void {
      const d = event.subject as NodeData;
      // Constrain drag position within bounds
      d.fx = Math.max(50, Math.min(width - 50, event.x));
      d.fy = Math.max(50, Math.min(height - 50, event.y));

      simulation.alpha(0.06).restart();
    }

    function dragended(
      event: D3DragEvent<SVGGElement, NodeData, unknown>,
    ): void {
      if (!event.active) simulation.alphaTarget(0);
      const d = event.subject as NodeData;
      d.fx = null;
      d.fy = null;

      simulation.alpha(0.06).restart();
    }
  }, [data, handleCharacterSelect, selectedFractalId]);

  useEffect(() => {
    setupVisualization();

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [setupVisualization]);

  if (!selectedFractalId) {
    return (
      <div className="w-full h-full border rounded-xl overflow-y-auto flex flex-col">
        <div className="w-full border-b py-1 px-2">
          <Select
            value={selectedFractalId?.toString()}
            onValueChange={(value) => setSelectedFractalId(Number(value))}
          >
            <SelectTrigger className="hover:bg-accent gap-2 border-none shadow-none h-5.5 text-sm">
              <SelectValue placeholder="Select a fractal" />
            </SelectTrigger>
            <SelectContent>
              {fractals?.length === 0 ? (
                <div className="py-2 text-sm text-muted-foreground text-center">
                  No fractals available
                </div>
              ) : (
                fractals?.map((fractal) => (
                  <SelectItem
                    key={fractal.id}
                    value={fractal.id.toString()}
                    onSelect={() => setSelectedFractalId(fractal.id)}
                  >
                    {fractal.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className=" w-full h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center border rounded-xl -mt-24 p-4 bg-accent max-w-md">
            <h2 className="text-lg font-medium mb-2">Character Graph</h2>
            <p className="text-sm text-muted-foreground">
              Select a fractal above to view the character graph. Fractals are
              collections of character and their relationships.
            </p>
            <br />
            <p className="text-sm text-muted-foreground">
              You can assign fractals to chapters and/or folders to help you
              organize your character and their changing relationships.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center relative"
    >
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : null}

      {data && data.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center border rounded-xl">
          <p className="text-sm text-muted-foreground">
            No character or relationships found for the selected fractal.
          </p>
        </div>
      ) : null}

      {data && data.length > 0 && selectedFractalId && (
        <div className="w-full h-full flex flex-col border rounded-xl bg-background grainy overflow-hidden">
          <div className="w-full border-b py-1 px-2 flex h-fit py-1.75">
            <Select
              value={selectedFractalId?.toString()}
              onValueChange={(value) => setSelectedFractalId(Number(value))}
            >
              <SelectTrigger className="hover:bg-accent gap-2 w-fit ml-auto border-none shadow-none h-5.5 text-sm self-end">
                <SelectValue placeholder="Select a fractal" />
              </SelectTrigger>
              <SelectContent>
                {fractals?.length === 0 ? (
                  <div className="py-2 text-sm text-muted-foreground text-center">
                    No fractals available
                  </div>
                ) : (
                  fractals?.map((fractal) => (
                    <SelectItem
                      key={fractal.id}
                      value={fractal.id.toString()}
                      onSelect={() => setSelectedFractalId(fractal.id)}
                    >
                      {fractal.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <svg ref={svgRef} className="w-full h-full" />
          {relationshipInfo && (
            <div className="border-t p-3 bg-accent z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Relationship</h3>
                  {relationshipInfo.hasObjectRelationship && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">
                          {relationshipInfo.targetName}
                        </span>{" "}
                        is a{" "}
                        <Badge
                          className={cn(
                            getRelationshipTypeColor(
                              relationshipInfo.objectType,
                            ),
                          )}
                        >
                          {relationshipInfo.objectType}
                        </Badge>{" "}
                        of{" "}
                        <span className="font-medium">
                          {relationshipInfo.sourceName}
                        </span>
                      </p>
                    </div>
                  )}
                  {relationshipInfo.hasSubjectRelationship && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <>
                        <span className="font-medium">
                          {relationshipInfo.sourceName}
                        </span>{" "}
                        has a{" "}
                        <Badge
                          className={cn(
                            getRelationshipTypeColor(
                              relationshipInfo.subjectType,
                            ),
                          )}
                        >
                          {relationshipInfo.subjectType}
                        </Badge>{" "}
                        with{" "}
                        <span className="font-medium">
                          {relationshipInfo.targetName}
                        </span>
                      </>
                    </p>
                  )}
                  {(!relationshipInfo.hasObjectRelationship ||
                    !relationshipInfo.hasSubjectRelationship) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      No relationship defined between{" "}
                      <span className="font-medium">
                        {!relationshipInfo.hasObjectRelationship
                          ? relationshipInfo.targetName
                          : relationshipInfo.sourceName}
                      </span>{" "}
                      and{" "}
                      <span className="font-medium">
                        {!relationshipInfo.hasSubjectRelationship
                          ? relationshipInfo.targetName
                          : relationshipInfo.sourceName}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  className="text-sm text-muted-foreground hover:text-foreground self-start"
                  onClick={() => setRelationshipInfo(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Relationship Info Panel */}
    </div>
  );
});

import { useEffect, useRef, useCallback, memo } from "react";
import * as d3 from "d3-force";
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import { type SimulationNodeDatum, type SimulationLinkDatum } from "d3-force";
import { type D3DragEvent } from "d3-drag";
import { type Selection, type BaseType } from "d3-selection";

interface CharacterRelationshipsGraphProps {
  characterId: number;
  characterName: string;
  relationships: Array<{
    relationship: {
      relationship_type: string;
      subject_character_id: number;
      object_character_id: number;
    };
    relatedCharacter: {
      id: number;
      name: string;
      age: number | null;
    };
    fractal: {
      id: number;
      name: string;
    };
  }>;
}

interface NodeData extends SimulationNodeDatum {
  id: number;
  name: string;
  type: string;
  age?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  isMainCharacter?: boolean;
}

interface LinkData extends SimulationLinkDatum<NodeData> {
  source: NodeData;
  target: NodeData;
  type: string;
  fractalName: string;
}

export const CharacterRelationshipsGraph = memo(
  function CharacterRelationshipsGraph({
    characterId,
    characterName,
    relationships,
  }: CharacterRelationshipsGraphProps): JSX.Element {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(
      null,
    );

    const setupVisualization = useCallback(() => {
      if (!svgRef.current || !relationships || !containerRef.current) return;

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

      // Add main character node
      nodeMap.set(characterId, {
        id: characterId,
        name: characterName,
        type: "main",
        isMainCharacter: true,
      });

      // Add related character nodes
      relationships.forEach((item) => {
        if (!nodeMap.has(item.relatedCharacter.id)) {
          nodeMap.set(item.relatedCharacter.id, {
            id: item.relatedCharacter.id,
            name: item.relatedCharacter.name,
            type: item.relationship.relationship_type,
            age: item.relatedCharacter.age ?? undefined,
          });
        }
      });

      const nodes = Array.from(nodeMap.values());

      // Create links for valid relationships
      const links: LinkData[] = relationships
        .map((item) => {
          const sourceNode = nodeMap.get(characterId);
          const targetNode = nodeMap.get(item.relatedCharacter.id);

          if (sourceNode && targetNode) {
            // Determine which node is the source and which is the target
            // based on the relationship direction
            const isMainCharacterSubject =
              item.relationship.subject_character_id === characterId;

            return {
              source: isMainCharacterSubject ? sourceNode : targetNode,
              target: isMainCharacterSubject ? targetNode : sourceNode,
              type: item.relationship.relationship_type,
              fractalName: item.fractal.name,
            };
          }

          return null;
        })
        .filter(Boolean) as LinkData[];

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
        .on("mouseover", function (_event: MouseEvent, d: LinkData) {
          // Highlight all edges with the same relationship type
          d3Selection
            .selectAll<SVGLineElement, LinkData>("line")
            .filter((linkData) => linkData.type === d.type)
            .attr("stroke", (linkData) => {
              switch (linkData.type) {
                case "friend":
                  return "hsl(var(--accent))";
                case "family":
                  return "hsl(var(--accent-foreground))";
                case "enemy":
                  return "hsl(var(--destructive))";
                default:
                  return "hsl(var(--muted-foreground))";
              }
            })
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 2);

          // Show tooltip with fractal name
          const tooltip = d3Selection
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "hsl(var(--background))")
            .style("border", "1px solid hsl(var(--border))")
            .style("border-radius", "4px")
            .style("padding", "4px 8px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "1000");

          tooltip.text(`Fractal: ${d.fractalName}`);
        })
        .on("mousemove", function (event: MouseEvent) {
          d3Selection
            .select(".tooltip")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function () {
          // Reset all edges to default style
          d3Selection
            .selectAll("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1);

          // Remove tooltip
          d3Selection.select(".tooltip").remove();
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
        .attr("stroke", "hsl(var(--muted-foreground))")
        .attr("stroke-width", 1)
        .attr("r", (d) => {
          if (d.isMainCharacter) return 20;

          // Default size is 10, scale up based on age
          const baseSize = 10;
          const age = d.age ?? 0;
          // Scale factor: 1 + (age/100) to make it reasonable
          // Add a maximum size of 40 to prevent extremely large nodes
          const calculatedSize = baseSize * (1 + age / 100);
          return Math.min(calculatedSize, 80);
        })
        .attr("fill", (d) => {
          if (d.isMainCharacter) return "hsl(var(--primary))";

          switch (d.type) {
            case "friend":
              return "hsl(var(--accent))";
            case "family":
              return "hsl(var(--accent-foreground))";
            case "enemy":
              return "hsl(var(--destructive))";
            default:
              return "hsl(var(--muted-foreground))";
          }
        });

      // Add labels to nodes
      node
        .append("text")
        .text((d) => d.name)
        .attr("x", 0)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "hsl(var(--foreground))")
        .attr("font-size", "12px");

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

      function dragged(
        event: D3DragEvent<SVGGElement, NodeData, unknown>,
      ): void {
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
    }, [relationships, characterId, characterName]);

    useEffect(() => {
      setupVisualization();

      // Cleanup
      return () => {
        if (simulationRef.current) {
          simulationRef.current.stop();
        }
      };
    }, [setupVisualization]);

    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      >
        {!relationships || relationships.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-background border rounded-lg">
            <p className="text-sm text-muted-foreground">
              No relationships found for this character.
            </p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full h-full border rounded-lg bg-background"
          />
        )}
      </div>
    );
  },
);

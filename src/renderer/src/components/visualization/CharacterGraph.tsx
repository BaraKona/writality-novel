import { useEffect, useRef } from "react";
import * as d3 from "d3-force";
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import { type SimulationNodeDatum, type SimulationLinkDatum } from "d3-force";
import { type D3DragEvent } from "d3-drag";
import { type Selection, type BaseType } from "d3-selection";
import { fractalCharacterRelationshipsTable } from "@db/schema";
import { charactersTable } from "@db/schema";

interface CharacterData {
  characters: typeof charactersTable.$inferSelect;
  fractal_character_relationships: typeof fractalCharacterRelationshipsTable.$inferSelect;
}

interface CharacterGraphProps {
  data: CharacterData[];
}

interface NodeData extends SimulationNodeDatum {
  id: number;
  name: string;
  type: string;
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

export function CharacterGraph({ data }: CharacterGraphProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // First pass: create nodes for all characters
    data.forEach((item) => {
      // Add subject character node
      if (!nodeMap.has(item.characters.id)) {
        nodeMap.set(item.characters.id, {
          id: item.characters.id,
          name: item.characters.name,
          type: item.fractal_character_relationships.relationship_type,
        });
      }

      // Add object character node
      if (
        !nodeMap.has(item.fractal_character_relationships.object_character_id)
      ) {
        // Find the object character in the data
        const objectCharacter = data.find(
          (d) =>
            d.characters.id ===
            item.fractal_character_relationships.object_character_id,
        );
        if (objectCharacter) {
          nodeMap.set(
            item.fractal_character_relationships.object_character_id,
            {
              id: objectCharacter.characters.id,
              name: objectCharacter.characters.name,
              type: objectCharacter.fractal_character_relationships
                .relationship_type,
            },
          );
        }
      }
    });

    const nodes = Array.from(nodeMap.values());

    // Create links for valid relationships
    const links: LinkData[] = data
      .filter((item) => {
        const sourceNode = nodeMap.get(item.characters.id);
        const targetNode = nodeMap.get(
          item.fractal_character_relationships.object_character_id,
        );
        return sourceNode && targetNode;
      })
      .map((item) => {
        const sourceNode = nodeMap.get(item.characters.id)!;
        const targetNode = nodeMap.get(
          item.fractal_character_relationships.object_character_id,
        )!;
        return {
          source: sourceNode,
          target: targetNode,
          type: item.fractal_character_relationships.relationship_type,
        };
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

    // Create the SVG elements
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

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
      .attr("r", 10)
      .attr("fill", (d) => {
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

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <svg
        ref={svgRef}
        className="w-full h-full border rounded-xl bg-background"
      />
    </div>
  );
}

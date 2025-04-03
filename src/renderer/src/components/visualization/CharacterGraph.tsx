import { useEffect, useRef, useCallback, memo } from "react";
import * as d3 from "d3-force";
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import { type SimulationNodeDatum, type SimulationLinkDatum } from "d3-force";
import { type D3DragEvent } from "d3-drag";
import { type Selection, type BaseType } from "d3-selection";
import { useCharactersWithFractalRelationships } from "@renderer/hooks/character/useCharacters";
import { Loader2 } from "lucide-react";

interface CharacterGraphProps {
  onCharacterSelect: (characterId: number) => void;
  selectedFractalId: number | null;
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
}

interface LinkData extends SimulationLinkDatum<NodeData> {
  source: NodeData;
  target: NodeData;
  type: string;
}

export const CharacterGraph = memo(function CharacterGraph({
  onCharacterSelect,
  selectedFractalId,
}: CharacterGraphProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);
  const { data, isLoading } =
    useCharactersWithFractalRelationships(selectedFractalId);

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
          type: item.fractal_character_relationships?.relationship_type,
          age: item.character.age ?? undefined,
        });
      }

      // Add object character node
      if (
        !nodeMap.has(item.fractal_character_relationships?.object_character_id)
      ) {
        const objectCharacter = data.find(
          (d) =>
            d.character.id ===
            item.fractal_character_relationships?.object_character_id,
        );
        if (objectCharacter) {
          nodeMap.set(
            item.fractal_character_relationships?.object_character_id,
            {
              id: objectCharacter.character.id,
              name: objectCharacter.character.name,
              type: objectCharacter.fractal_character_relationships
                ?.relationship_type,
              age: objectCharacter.character.age ?? undefined,
            },
          );
        }
      }
    });

    const nodes = Array.from(nodeMap.values());

    // Create links for valid relationships
    const links: LinkData[] = data.flatMap((item) => {
      const links: LinkData[] = [];

      // Case 1: Current character is the subject
      const sourceNode = nodeMap.get(item.character.id);
      const targetNode = nodeMap.get(
        item.fractal_character_relationships?.object_character_id,
      );
      if (sourceNode && targetNode) {
        links.push({
          source: sourceNode,
          target: targetNode,
          type: item.fractal_character_relationships?.relationship_type,
        });
      }

      // Case 2: Current character is the object
      const objectSourceNode = nodeMap.get(
        item.fractal_character_relationships?.subject_character_id,
      );
      const objectTargetNode = nodeMap.get(item.character.id);
      if (objectSourceNode && objectTargetNode) {
        links.push({
          source: objectSourceNode,
          target: objectTargetNode,
          type: item.fractal_character_relationships?.relationship_type,
        });
      }

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
      })
      .on("mouseout", function () {
        // Reset all edges to default style
        d3Selection
          .selectAll("line")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", 1);
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
        // Default size is 10, scale up based on age
        const baseSize = 10;
        const age = d.age ?? 0;
        // Scale factor: 1 + (age/100) to make it reasonable
        // Add a maximum size of 40 to prevent extremely large nodes
        const calculatedSize = baseSize * (1 + age / 100);
        return Math.min(calculatedSize, 80);
      })
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
  }, [data, handleCharacterSelect]);

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
      <div className="w-full h-full flex flex-col items-center justify-center border rounded-xl">
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
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
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
        <svg
          ref={svgRef}
          className="w-full h-full border rounded-xl bg-background "
        />
      )}
    </div>
  );
});

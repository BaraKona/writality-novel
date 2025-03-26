import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  fractalsTable,
  fractalCharacterRelationshipsTable,
} from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { Node, Edge } from "reactflow";
import { serialize } from "@renderer/db";

interface FractalState {
  nodes: Node[];
  edges: Edge[];
}

export const useSaveFractalState = (
  fractalId: number,
): UseMutationResult<void, Error, FractalState> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveFractalState", fractalId],
    mutationFn: async (state: FractalState) => {
      // Delete existing relationships
      await database
        .delete(fractalCharacterRelationshipsTable)
        .where(eq(fractalCharacterRelationshipsTable.fractal_id, fractalId))
        .run();

      // Create new relationships from edges
      const relationships = state.edges
        .filter((edge) => edge.type === "relationshipEdge")
        .map((edge) => {
          const sourceNode = state.nodes.find((n) => n.id === edge.source);
          const targetNode = state.nodes.find((n) => n.id === edge.target);

          if (!sourceNode?.data.characterId || !targetNode?.data.characterId) {
            return null;
          }

          return {
            fractal_id: fractalId,
            subject_character_id: sourceNode.data.characterId,
            object_character_id: targetNode.data.characterId,
            relationship_type: edge.data?.type || "friend",
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null);

      if (relationships.length > 0) {
        await database
          .insert(fractalCharacterRelationshipsTable)
          .values(relationships)
          .run();
      }

      // Update fractal description with nodes and edges
      const fractalState = {
        nodes: state.nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: state.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          data: edge.data,
        })),
      };

      await database
        .update(fractalsTable)
        .set({
          description: serialize(fractalState),
        })
        .where(eq(fractalsTable.id, fractalId))
        .run();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fractal", fractalId],
      });
    },
  });
};

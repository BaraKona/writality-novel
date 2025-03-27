import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import { charactersTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { Value } from "@udecode/plate";
import { toast } from "sonner";

type CharacterUpdate = Omit<
  typeof charactersTable.$inferSelect,
  "description"
> & {
  description: Value;
};

export const useUpdateCharacter = (): UseMutationResult<
  CharacterUpdate,
  Value,
  CharacterUpdate
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (character: CharacterUpdate) => {
      await database.transaction(async (tx) => {
        await tx
          .update(charactersTable)
          .set({
            ...character,
            description: serialize(character.description),
          })
          .where(eq(charactersTable.id, character.id))
          .run();
      });
      return character;
    },
    onSuccess: (character) => {
      queryClient.setQueryData(
        ["character", character.id],
        (oldData: CharacterUpdate | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, name: character.name };
        },
      );
      toast.success("Character updated");
    },
    mutationKey: ["updateCharacter"],
  });
};

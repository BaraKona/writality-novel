import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { charactersTable } from "../../../../db/schema";
import { serialize } from "@renderer/db";
import { Value } from "@udecode/plate";

type Character = typeof charactersTable.$inferSelect & {
  description: Value;
  traits: string[];
};

type CreateCharacterInput = {
  name: string;
  description: Value;
  status?: string;
  sex?: string;
  age?: number;
  occupation?: string;
  traits?: string[];
};

export const useCreateCharacter = (): ReturnType<
  typeof useMutation<Character, Error, CreateCharacterInput>
> => {
  const queryClient = useQueryClient();

  return useMutation<Character, Error, CreateCharacterInput>({
    mutationKey: ["createCharacter"],
    mutationFn: async (character) => {
      const result = await database
        .insert(charactersTable)
        .values({
          name: character.name,
          description: serialize(character.description),
          status: character.status || "alive",
          sex: character.sex,
          age: character.age,
          traits: character.traits ? JSON.stringify(character.traits) : null,
        })
        .returning()
        .get();

      return {
        ...result,
        description: character.description,
        traits: character.traits || [],
      } as Character;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["characters"],
      });
    },
  });
};

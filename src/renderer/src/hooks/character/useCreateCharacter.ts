import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { charactersTable } from "../../../../db/schema";
import { serialize } from "@renderer/db";
import { Value } from "@udecode/plate";

type Character = {
  id: number;
  name: string;
  description: Value;
  status: string;
  project_id: number;
  sex: string | null;
  age: number | null;
  traits: string[];
  faction: string | null;
  occupation: string | null;
  appearance: string | null;
  created_at: Date;
  updated_at: Date;
};

type CreateCharacterInput = {
  name: string;
  description: Value;
  status?: string;
  sex?: string;
  age?: number;
  occupation?: string;
  traits?: string[];
  faction?: string;
  appearance?: string;
  project_id: number;
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
          faction: character.faction,
          occupation: character.occupation,
          appearance: character.appearance,
          project_id: character.project_id,
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

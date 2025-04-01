import {
  charactersTable,
  fractalCharacterRelationshipsTable,
} from "@db/schema";
import { useCharacterRelationships } from "@renderer/hooks/character/useCharacterRelationships";
import { useCharacters } from "@renderer/hooks/character/useCharacters";
import { useMemo } from "react";
import { RelationshipBadge } from "./RelationshipBadge";

type SelectedCharacter = {
  id: number;
  age: number | null;
  sex: string | null;
  name: string;
};

type RelationshipGroupProps = {
  group: {
    fractal: { id: number; name: string };
    relationships: Array<{
      relationship: typeof fractalCharacterRelationshipsTable.$inferSelect;
      relatedCharacter: SelectedCharacter;
    }>;
  };
  characterId: number;
  characterMap: Map<number, string>;
};

const RelationshipGroup = ({
  group,
  characterId,
  characterMap,
}: RelationshipGroupProps): JSX.Element => {
  const groupedRelationships = useMemo(() => {
    return Object.values(
      group.relationships.reduce(
        (acc, rel) => {
          const charId = rel.relatedCharacter.id;
          if (!acc[charId]) {
            acc[charId] = {
              character: rel.relatedCharacter,
              relationships: [],
            };
          }
          acc[charId].relationships.push(rel);
          return acc;
        },
        {} as Record<
          number,
          {
            character: SelectedCharacter;
            relationships: typeof group.relationships;
          }
        >,
      ),
    );
  }, [group.relationships]);

  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/50">
        {group.fractal.name}
      </h4>
      {groupedRelationships.map(
        ({ character: relatedCharacter, relationships }) => {
          const displayName =
            characterMap.get(relatedCharacter.id) ||
            `Character ${relatedCharacter.id}`;

          return (
            <div
              key={relatedCharacter.id}
              className="flex items-center justify-between px-2 py-1 hover:bg-accent rounded-md transition-colors"
            >
              <span className="text-sm">{displayName}</span>
              <div className="flex items-center gap-2">
                {relationships.map((rel) => (
                  <div
                    key={`${rel.relationship.id}-${rel.relationship.subject_character_id === characterId ? "outgoing" : "incoming"}`}
                  >
                    <RelationshipBadge
                      rel={rel.relationship}
                      direction={
                        rel.relationship.subject_character_id === characterId
                          ? "outgoing"
                          : "incoming"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
};

export function CharacterCardRelationships({
  character,
}: {
  character: typeof charactersTable.$inferSelect;
}): JSX.Element {
  const { data: relationshipGroups } = useCharacterRelationships(character.id);
  const { data: allCharacters } = useCharacters();

  const characterMap = useMemo(() => {
    if (!allCharacters) return new Map<number, string>();
    return new Map(allCharacters.map((char) => [char.id, char.name]));
  }, [allCharacters]);

  return (
    <div className="flex flex-col gap-2 pb-2 p-2 border rounded-lg bg-card">
      <h3 className="text-sm font-medium px-2">Relationships</h3>
      {relationshipGroups && relationshipGroups.length > 0 ? (
        <div className="flex flex-col">
          {relationshipGroups.map((group, index) => (
            <div key={group.fractal.id}>
              {index > 0 && <div className="h-px bg-border my-2" />}
              <RelationshipGroup
                group={group}
                characterId={character.id}
                characterMap={characterMap}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-4">
          No relationships defined yet
        </div>
      )}
    </div>
  );
}

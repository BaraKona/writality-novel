import { charactersTable } from "@db/schema";
import { useCharacterRelationships } from "@renderer/hooks/character/useCharacterRelationships";

export function CharacterCardRelationships({
  character,
}: {
  character: typeof charactersTable.$inferSelect;
}): JSX.Element {
  const { data: relationships } = useCharacterRelationships(character.id);

  return (
    <div className="flex flex-col gap-2 pb-2 p-2 border rounded-lg">
      {relationships?.map((rel) => (
        <div
          key={rel.relationship.id}
          className="flex items-center justify-between"
        >
          <span className="text-sm">{rel.relatedCharacter.name}</span>
          <span className="text-xs text-muted-foreground">
            {rel.relationship.relationship_type}
          </span>
        </div>
      ))}
      {(!relationships || relationships?.length === 0) && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No relationships defined yet
        </div>
      )}
    </div>
  );
}

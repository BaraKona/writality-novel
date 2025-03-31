import { useCharacter } from "@renderer/hooks/character/useCharacter";
import { CharacterCard } from "../character/CharacterCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const CharacterSidebar = ({
  characterId,
}: {
  characterId: number | null;
}): JSX.Element => {
  const { data: character } = useCharacter(characterId as number);

  const [animate] = useAutoAnimate();
  return (
    <div className="border h-full rounded-l-xl bg-tertiary">
      <h2 className="border-b border-border px-3 py-1 pb-1.25">Character</h2>
      {character ? (
        <div className="p-2" ref={animate}>
          <CharacterCard character={character} />
        </div>
      ) : (
        <div className="p-2 flex justify-center mt-12">
          <div className="border-sidebar-primary text-sm text-secondary-sidebar-primary p-1.5 px-2 border gap-2 flex items-start rounded-md bg-sidebar-primary/40 ">
            No character selected
          </div>
        </div>
      )}
    </div>
  );
};

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
      <div className="p-2" ref={animate}>
        {character && <CharacterCard character={character} />}
      </div>
    </div>
  );
};

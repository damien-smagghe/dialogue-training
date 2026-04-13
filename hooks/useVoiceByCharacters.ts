import { useState } from "react";

export const useVoiceByCharacters = <Character extends string>(
  characters: Character[]
) => {
  const [voiceByCharacters, setVoiceByCharacters] = useState<
    Record<Character, string | undefined>
  >(
    characters.reduce(
      (acc, character) => ({ ...acc, [character]: undefined }),
      {} as Record<Character, string | undefined>,
    ),
  );

  const handleCharacterVoiceChange = (
    character: Character,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setVoiceByCharacters({
      ...voiceByCharacters,
      [character]: event.target.value,
    });
  };

  return {
    voiceByCharacters,
    handleCharacterVoiceChange,
  };
};
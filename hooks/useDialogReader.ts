import { useState, useEffect } from "react";
import useSequentialReader from "./useSequentialReader";
import speech from "../utils/speech";

export type UseDialogReaderResult = ReturnType<typeof useDialogReader>;

export type ReadingTime = ReturnType<typeof useSequentialReader>["readingTimes"][number];

const useSequentialReaderWithTimes = useSequentialReader as (args: Parameters<typeof useSequentialReader>[0]) => ReturnType<typeof useSequentialReader> & {
  readingTimes: ReadingTime[];
  dialogue: string;
  key: string;
  readingTime: number;
  isRead: boolean;
}

export const useDialogReader = ({
  dialogues,
  characters,
}: {
  dialogues: readonly { dialogue: string; name: string; key: string }[][];
  characters: string[];
})  => {
  // french Voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const allVoices = window.speechSynthesis.getVoices();
        const frenchVoices = allVoices.filter((voice) =>
          voice.lang.includes("fr"),
        );
        setVoices(frenchVoices);
        const [firstVoice] = frenchVoices;
        if (!firstVoice) {
          return 
        }
        setVoiceNameByCharacters(
          characters.reduce(
            (acc, character) => ({ ...acc, [character]: firstVoice.name }),
            {} as Record<string, string | undefined>,
          ),
        );
      }
    };

    // Load voices immediately
    loadVoices();

    // Also try to get voices after a short delay (some browsers load lazily)
    const timer = setTimeout(loadVoices, 100);

    return () => clearTimeout(timer);
  }, [characters]);

  // Voices by Characters
  const [voiceNameByCharacters, setVoiceNameByCharacters] = useState<
    Record<string, string | undefined>
  >(
    characters.reduce(
      (acc, character) => ({ ...acc, [character]: undefined }),
      {} as Record<string, string | undefined>,
    ),
  );
  const handleCharacterVoiceChange = (
    character: string,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const voiceName = event.target.value
    setVoiceNameByCharacters({
      ...voiceNameByCharacters,
      [character]: voiceName,
    });
    stop()
    speech({text: voiceName, voice: voices.find(({ name }) => name === voiceName)! })
  };
  const voiceByCharacters = Object.keys(voiceNameByCharacters).reduce(
    (acc, characterName) => {
      const voiceName = voiceNameByCharacters[characterName];
      const voice = voices.find(({ name }) => name === voiceName);
      return {
        ...acc,
        [characterName]: voice,
      };
    },
    {},
  );

  const { start, stop, reading, readingText, readingTimes } = useSequentialReaderWithTimes({
    voices: voiceByCharacters,
    textsToRead: dialogues.flat().map(({ dialogue, name, key }) => ({
      text: dialogue,
      voiceName: name,
      key,
    })),
  });

  return {
    voices,
    reading,
    start,
    stop,
    voiceNameByCharacters,
    handleCharacterVoiceChange,
    readingText,
    readingTimes
  };
};

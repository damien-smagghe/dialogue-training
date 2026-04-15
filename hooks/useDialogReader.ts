import { useState, useEffect } from "react";
import useSequentialReader from "./useSequentialReader";
import speech from "../utils/speech";
import useSession from "./useSession.ts";
export type UseDialogReaderResult = ReturnType<typeof useDialogReader>;

export type ReadingTime = ReturnType<
  typeof useSequentialReader
>["readingTimes"][number];

const useSequentialReaderWithTimes = useSequentialReader as (
  args: Parameters<typeof useSequentialReader>[0],
) => ReturnType<typeof useSequentialReader> & {
  readingTimes: ReadingTime[];
  dialogue: string;
  key: string;
  readingTime: number;
  isRead: boolean;
};

export const useDialogReader = ({
  dialogues,
  characters,
  hideCharacterDialogue,
  muteSelectedCharacter
}: {
  dialogues: readonly {
    dialogue: string;
    name: string;
    key: string;
    readingTime: number;
  }[][];
  characters: string[];
  hideCharacterDialogue: boolean;
  muteSelectedCharacter?: boolean;
}) => {
  const { session, updateSession } = useSession();
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
          return;
        }
        setVoiceNameByCharacters({
          ...characters.reduce(
            (acc, character) => ({ ...acc, [character]: firstVoice.name }),
            {} as Record<string, string | undefined>,
          ),
          ...voiceNameByCharacters,
        });
      }
    };

    // Load voices immediately
    loadVoices();

    // Also try to get voices after a short delay (some browsers load lazily)
    const timer = setTimeout(loadVoices, 100);

    return () => clearTimeout(timer);
  }, [characters]);

  // Voices by Characters
  console.log("session ->", session);
  const { voiceNameByCharacters } = session;
  const setVoiceNameByCharacters = (
    newVoiceNameByCharacters: Record<string, string | undefined>,
  ) => updateSession({ voiceNameByCharacters: newVoiceNameByCharacters });
  useEffect(() => {
    console.log("setVoiceNameByCharacters -> ", voiceNameByCharacters, {
      ...characters.reduce(
        (acc, character) => ({ ...acc, [character]: undefined }),
        {} as Record<string, string | undefined>,
      ),
      ...voiceNameByCharacters,
    });
    // setVoiceNameByCharacters({
    //   ...characters.reduce(
    //     (acc, character) => ({ ...acc, [character]: undefined }),
    //     {} as Record<string, string | undefined>,
    //   ),
    //   ...voiceNameByCharacters,
    // });
  }, []);

  const { selectedCharacter } = session;
  const setSelectedCharacter = (newSelectedCharacter) =>
    updateSession({ selectedCharacter: newSelectedCharacter });

  const handleCharacterVoiceChange = (
    character: string,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const voiceName = event.target.value;
    setVoiceNameByCharacters({
      ...voiceNameByCharacters,
      [character]: voiceName,
    });
    stop();
    setTimeout(() => {
      speech({
        text: voiceName,
        voice: voices.find(({ name }) => name === voiceName)!,
      });
    }, 100)
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

  const { start, stop, reading, readingText, readingTimes } =
    useSequentialReaderWithTimes({
      voices: voiceByCharacters,
      textsToRead: dialogues
        .flat()
        .map(({ dialogue, name, key, readingTime }) => ({
          text: dialogue,
          voiceName: name,
          key,
          readingTime,
          muted: (name === selectedCharacter && (hideCharacterDialogue || muteSelectedCharacter))
        })),
    });

  console.log("readingTimes ->", readingTimes);

  return {
    voices,
    reading,
    start,
    stop,
    voiceNameByCharacters,
    handleCharacterVoiceChange,
    readingText,
    readingTimes,
    selectedCharacter,
    setSelectedCharacter,
  };
};

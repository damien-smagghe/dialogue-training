import { useState, useCallback, useEffect, useRef } from "react";

import speech from "../utils/speech";

interface ReadingTime {
  dialogue: string;
  key: string;
  readingTime: number;
  isRead: boolean;
}

const useSequentialReader = ({
  voices,
  textsToRead,
}: {
  voices: Record<string, SpeechSynthesisVoice | undefined>;
  textsToRead: { text: string; voiceName: string; key: string }[];
}) => {
  const [reading, setReading] = useState<boolean>(false);
  const [redingIndex, setRedingIndex] = useState<number>(-1);
  const [readingTimes, setReadingTimes] = useState<ReadingTime[]>([]);
  const dialogueStartTime = useRef<number | null>(null);
  const isWaiting = useRef<null | NodeJS.Timeout>(null);
  const speechWorking = useRef(false);

  const start = (targetKey: string) => {
    if (isWaiting.current) {
      return;
    }
    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isWaiting.current) {
        clearTimeout(isWaiting.current)
        isWaiting.current = null
      }
      speechWorking.current = false;
    }

    const targetIndex = targetKey
      ? textsToRead.findIndex(({ key }) => key === targetKey)
      : 0;

    setReading(true);
    setRedingIndex(targetIndex);
  };

  const stop = useCallback(() => {
    setReading(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isWaiting.current) {
        clearTimeout(isWaiting.current)
        isWaiting.current = null
      }
      speechWorking.current = false;
    }
  }, []);

  const readText = useCallback(
    async (index: number) => {
      const textToRead: string = textsToRead[index].text;
      const voiceName: string = textsToRead[index].voiceName;
      const dialogueKey: string = textsToRead[index].key;
      if (!textToRead || !reading) {
        return;
      }

      // Start timing for this dialogue
      dialogueStartTime.current = Date.now();

      // Create speech utterance for current dialogue
      speechWorking.current = true;
      try {
        await speech({ text: textToRead, voice: voices[voiceName]! });
      } finally {
        speechWorking.current = false;
      }

      // Calculate reading time after speech finishes
      if (dialogueStartTime.current != null) {
        const endTime = Date.now();
        const readingTime = (endTime - dialogueStartTime.current) / 1000; // seconds
        const newReadingTimes = [...readingTimes];
        // Find if this dialogue's time is already in the array
        const existingIndex = newReadingTimes.findIndex(
          (rt) => rt.key === dialogueKey,
        );
        if (existingIndex >= 0) {
          newReadingTimes[existingIndex] = {
            ...newReadingTimes[existingIndex],
            readingTime,
            isRead: true,
          };
        } else {
          newReadingTimes.push({
            dialogue: textToRead,
            key: dialogueKey,
            readingTime,
            isRead: true,
          });
        }
        setReadingTimes(newReadingTimes);
      }

      // Move to next dialogue
      if (reading) {
        setRedingIndex(index + 1);
      }
    },
    [reading, textsToRead, voices, readingTimes],
  );

  useEffect(() => {
    if (reading) {
      // Speak with 0.2 second delay from previous dialogue
      if (!isWaiting.current && !speechWorking.current) {
        isWaiting.current = setTimeout(() => {
          isWaiting.current = null;
          readText(redingIndex);
        }, 200);
      }
    }
  }, [reading, redingIndex, readText]);

  const readingText = textsToRead[redingIndex];

  return { start, stop, reading, readingText, readingTimes };
};

export default useSequentialReader;

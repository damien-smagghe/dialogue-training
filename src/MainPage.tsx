import styles from "./styles.module.scss";
import { useDialogReader } from "../hooks/useDialogReader";
import { useState, useEffect, useRef } from "react";
import type { ReadingMode } from "./types";
// import times from "../times.json";
import VoiceSelectorModal from "./components/VoiceSelectorModal";
import DialogueList from "./components/DialogueList";
import Header from "./components/Header";
import StickyControls from "./components/StickyControls";
import { groupDialoguesByCharacter } from "../utils/groupDialoguesByCharacter";
import "./global-styles.scss";
import useSession from "../hooks/useSession.ts";

interface MainPageProps {
  dialogues: readonly {
    dialogue: string;
    name: string;
    key: string;
    readingTime?: number;
  }[][];
  characters: readonly string[];
}

// const timeByKeys = times.reduce(
//   (acc, { readingTime, key }) => ({ ...acc, [key]: readingTime }),
//   {},
// ) as Record<string, number>;

const MainPage = ({ dialogues, characters }: MainPageProps) => {
  const { session, updateSession } = useSession();

  const [currentPageNumber, setCurrentPage] = useState(0);

  const [hideCharacterDialogue, setHideCharacterDialogue] = useState(true);
  const [muteSelectedCharacter, setMuteSelectedCharacter] = useState(true);
  const [readingMode, setReadingMode] = useState<ReadingMode>("document");
  const { selectedCharacter } = session;
  const setSelectedCharacter = (newSelectedCharacter) =>
    updateSession({ selectedCharacter: newSelectedCharacter });

  // Compute displayed content based on reading mode
  const displayedContent =
    readingMode === "training"
      ? groupDialoguesByCharacter(
          dialogues,
          selectedCharacter || null,
        )
      : dialogues;

  const {
    voices,
    start,
    stop,
    voiceNameByCharacters,
    handleCharacterVoiceChange,
    reading,
    readingText,
  } = useDialogReader({
    dialogues: displayedContent,
    characters: Array.from(characters),
    hideCharacterDialogue: muteSelectedCharacter,
    readingMode,
    selectedCharacter
  });


  const currentDialoguePage = displayedContent[Math.min(currentPageNumber, displayedContent.length-1)] || [];

  const goToPreviousPage = () => {
    if (!prevPageDisabled) {
      setCurrentPage(currentPageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (!nextPageDisabled) {
      setCurrentPage(currentPageNumber + 1);
    }
  };

  const handleStart = () => {
    const [fistDialogueItem] = currentDialoguePage;
    start(fistDialogueItem.key);
  };

  // Reset page when reading mode changes
  useEffect(() => {
    setCurrentPage(0);
    stop();
  }, [readingMode]);

  useEffect(() => {
    if (reading) {
      const readingInCurrentPage = currentDialoguePage.some(
        (dialogue) => dialogue.key === readingText.key,
      );
      if (!readingInCurrentPage) {
        const newPageNumber = displayedContent.findIndex((page) =>
          page.some((dialogue) => dialogue.key === readingText.key),
        );
        if (newPageNumber !== -1) {
          setCurrentPage(newPageNumber);
        }
      }
    }
  }, [currentDialoguePage, reading, readingText, displayedContent]);

  const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
  useEffect(() => {
    if (!selectedCharacter) {
      setIsVoiceSelectorOpen(true);
    }
  }, []);
  const dialogueListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active dialogue item
  useEffect(() => {
    if (readingText && dialogueListRef.current) {
      const activeElement = dialogueListRef.current.querySelector(
        `[data-dialogue-key="${readingText.key}"]`,
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [readingText]);

  const readSpecificDialogue = (dialogueItem: {
    name: string;
    dialogue: string;
    key: string;
  }) => {
    console.log("Reading dialogue:", dialogueItem);
    start(dialogueItem.key);
  };

  const totalPages = displayedContent.length;
  const prevPageDisabled = reading || currentPageNumber === 0;
  const nextPageDisabled = reading || currentPageNumber === totalPages - 1;

  return (
    <>
      <div className={styles.pageBody}>
        <Header
          onToggleSettings={() => setIsVoiceSelectorOpen(!isVoiceSelectorOpen)}
          readingMode={readingMode}
          setReadingMode={setReadingMode}
        />

        {/* Current Page Dialogue List */}
        <DialogueList
          currentDialoguePage={currentDialoguePage}
          readingText={reading ? readingText : null}
          selectedCharacter={selectedCharacter}
          hideCharacterDialogue={hideCharacterDialogue}
          readSpecificDialogue={readSpecificDialogue}
          dialogueListRef={dialogueListRef}
        />

        {/* Voice Selector Modal */}
        <VoiceSelectorModal
          isOpen={isVoiceSelectorOpen}
          onClose={() => setIsVoiceSelectorOpen(false)}
          characters={characters}
          voices={voices}
          voiceNameByCharacters={voiceNameByCharacters}
          selectedCharacter={selectedCharacter}
          hideCharacterDialogue={hideCharacterDialogue}
          handleCharacterVoiceChange={handleCharacterVoiceChange}
          setSelectedCharacter={setSelectedCharacter}
          setHideCharacterDialogue={setHideCharacterDialogue}
          start={start}
          currentDialoguePage={currentDialoguePage}
          muteSelectedCharacter={muteSelectedCharacter}
          setMuteSelectedCharacter={setMuteSelectedCharacter}
        />

        {/* Sticky Play/Stop Buttons */}
        <StickyControls
          currentPageNumber={currentPageNumber}
          totalPages={totalPages}
          prevPageDisabled={prevPageDisabled}
          nextPageDisabled={nextPageDisabled}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          reading={reading}
          handleStart={handleStart}
          stop={stop}
        />
      </div>
    </>
  );
};

export default MainPage;

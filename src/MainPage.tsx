import styles from "./styles.module.scss";
import { useDialogReader } from "../hooks/useDialogReader";
import { useState, useEffect, useRef } from "react";
import SettingsIcon from "./components/SettingsIcon.svg";
// import times from "../times.json";
import VoiceSelectorModal from "./components/VoiceSelectorModal";
import DialogueList from "./components/DialogueList";
import PaginationControls from "./components/PaginationControls";
import StickyControls from "./components/StickyControls";

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

const Hero = ({ dialogues, characters }: MainPageProps) => {
  const [currentPageNumber, setCurrentPage] = useState(0);
  const currentDialoguePage = dialogues[currentPageNumber] || [];

  // const newDialogues = dialogues.map((page) =>
  //   page.map((dialogue) => ({
  //     ...dialogue,
  //     readingTime: timeByKeys[dialogue.key] || dialogue.readingTime,
  //   })),
  // );
  // console.log("newDialogues ->", newDialogues);
  const totalPages = dialogues.length;
  const isFirstPage = currentPageNumber === 0;
  const isLastPage = currentPageNumber === totalPages - 1;

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPage(currentPageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      setCurrentPage(currentPageNumber + 1);
    }
  };

  const handleStart = () => {
    const [fistDialogueItem] = currentDialoguePage;
    start(fistDialogueItem.key);
  };

  const [hideCharacterDialogue, setHideCharacterDialogue] = useState(true);
  const [muteSelectedCharacter, setMuteSelectedCharacter] = useState(false);
  const {
    voices,
    start,
    stop,
    voiceNameByCharacters,
    handleCharacterVoiceChange,
    reading,
    readingText,
    selectedCharacter,
    setSelectedCharacter,
  } = useDialogReader({ dialogues, characters, hideCharacterDialogue });
  useEffect(() => {
    if (reading) {
      const readingInCurrentPage = currentDialoguePage.some(
        (dialogue) => dialogue.key === readingText.key,
      );
      if (!readingInCurrentPage) {
        const newPageNumber = dialogues.findIndex((page) =>
          page.some((dialogue) => dialogue.key === readingText.key),
        );
        if (newPageNumber !== -1) {
          setCurrentPage(newPageNumber);
        }
      }
    }
  }, [currentDialoguePage, reading, readingText]);

  const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
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

  return (
    <>
      <div className={styles.hero}>
        {/* Voice Selector Toggle */}
        <div className={styles.voiceSelectorContainer}>
          <button
            className={styles.voiceSelectorToggle}
            onClick={() => setIsVoiceSelectorOpen(!isVoiceSelectorOpen)}
            aria-label="Settings"
          >
            {/* <SettingsIcon color="#3b82f6" /> */}
            <span style={{ marginLeft: "0.5rem", fontSize: "14px" }}>
              Voice & Character Settings
            </span>
          </button>
        </div>

        {/* Pagination Controls */}
        <PaginationControls
          currentPageNumber={currentPageNumber}
          totalPages={totalPages}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          hideCharacterDialogue={hideCharacterDialogue}
          setHideCharacterDialogue={setHideCharacterDialogue}
          muteSelectedCharacter={muteSelectedCharacter}
          setMuteSelectedCharacter={setMuteSelectedCharacter}
        />

        {/* Current Page Dialogue List */}
        <DialogueList
          currentDialoguePage={currentDialoguePage}
          readingText={readingText}
          selectedCharacter={selectedCharacter}
          hideCharacterDialogue={hideCharacterDialogue}
          muteSelectedCharacter={muteSelectedCharacter}
          readSpecificDialogue={readSpecificDialogue}
          dialogueListRef={dialogueListRef}
          setHideCharacterDialogue={setHideCharacterDialogue}
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
        />

        {/* Sticky Play/Stop Buttons */}
        <StickyControls
          reading={reading}
          handleStart={handleStart}
          stop={stop}
        />
      </div>
    </>
  );
};

export default Hero;

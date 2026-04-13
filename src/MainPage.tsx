import styles from "./styles.module.scss";
import { useDialogReader } from "../hooks/useDialogReader";
import { useState, useEffect, useRef } from "react";

interface MainPageProps {
  dialogues: readonly {
    dialogue: string;
    name: string;
    key: string;
  }[][];
  characters: readonly string[];
}

const Hero = ({ dialogues, characters }: MainPageProps) => {
  const [currentPageNumber, setCurrentPage] = useState(0);
  const currentDialoguePage = dialogues[currentPageNumber] || [];

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

  const {
    voices,
    start,
    stop,
    voiceNameByCharacters,
    handleCharacterVoiceChange,
    reading,
    readingText,
    readingTimes,
  } = useDialogReader({ dialogues: dialogues, characters });
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
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [hideCharacterDialogue, setHideCharacterDialogue] = useState(false);

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
          >
            Voice & Character Settings
          </button>

          {isVoiceSelectorOpen && (
            <div className={styles.voiceSelectorDropdown}>
              {/* Character Voice Selectors */}
              <div className={styles.voiceSelectorGroup}>
                <label>Character Voices:</label>
                {characters.map((name) => (
                  <div key={name} className={styles.characterVoiceSelector}>
                    <span>{name}:</span>
                    <select
                      onChange={(event) => handleCharacterVoiceChange(name, event)}
                      value={voiceNameByCharacters[name]}
                    >
                      <option value="">Select a French Voice for {name}</option>
                      {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Character Selection */}
              <div className={styles.voiceSelectorGroup}>
                <label htmlFor="character-select" className={styles.characterSelection}>
                  Selected Character:
                </label>
                <select
                  id="character-select"
                  onChange={(event) => {
                    setSelectedCharacter(event.target.value);
                    const [firstDialogueItem] = currentDialoguePage;
                    start(firstDialogueItem.key);
                  }}
                  value={selectedCharacter || characters[0] || ""}
                >
                  <option value="">Select a character to focus on</option>
                  {characters.map((character) => (
                    <option key={character} value={character}>
                      {character}
                    </option>
                  ))}
                </select>

                {/* Hide Dialogue Toggle */}
                <div style={{ marginTop: "10px" }}>
                  <label style={{ fontSize: "14px", color: "#333" }}>
                    <input
                      type="checkbox"
                      checked={hideCharacterDialogue}
                      onChange={(e) => setHideCharacterDialogue(e.target.checked)}
                    />{" "}
                    Hide dialogue text for {selectedCharacter || "no character"}
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className={styles.paginationControls}>
          <button
            className={styles.paginationButton}
            onClick={goToPreviousPage}
            disabled={isFirstPage}
          >
            Previous
          </button>

          <span className={styles.pageIndicator}>
            Page {currentPageNumber + 1} of {totalPages}
          </span>

          <button
            className={styles.paginationButton}
            onClick={goToNextPage}
            disabled={isLastPage}
          >
            Next
          </button>
        </div>

        {/* Current Page Dialogue List */}
        <div className={styles.dialogueList} ref={dialogueListRef}>
          {currentDialoguePage.map((item) => (
            <button
              key={item.key}
              data-dialogue-key={item.key}
              className={`${styles.dialogueItem} ${
                readingText?.key === item.key ? styles.dialogueItemReading : ""
              }`}
              onClick={() => readSpecificDialogue(item)}
              disabled={selectedCharacter != null && item.name === selectedCharacter}
              type="button"
            >
              <span
                className={`${styles.characterName} ${
                  selectedCharacter != null && item.name === selectedCharacter
                    ? styles.selectedCharacter
                    : ""
                }`}
              >
                {item.name}
              </span>
              {selectedCharacter != null && item.name === selectedCharacter ? (
                <span className={styles.dialogueText}>
                  <em style={{ color: "#999", fontStyle: "italic" }}>
                    (Disabled)
                  </em>
                </span>
              ) : (
                <>
                  <span className={styles.dialogueText}>{item.dialogue}</span>
                  {readingTimes.some((rt) => rt.key === item.key) && (
                    <span className={styles.readingTime}>
                      ⏱️ {readingTimes.find((rt) => rt.key === item.key)?.readingTime.toFixed(1)}s
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Sticky Play/Stop Buttons */}
        <div className={styles.stickyControls}>
          <button
            className={`${styles.heroButton} ${styles.playButton}`}
            onClick={handleStart}
            disabled={reading}
          >
            {reading ? "Reading..." : "Play"}
          </button>
          <button
            className={`${styles.heroButton} ${styles.stopButton}`}
            onClick={stop}
            disabled={!reading}
          >
            Stop
          </button>
        </div>
      </div>
    </>
  );
};

export default Hero;

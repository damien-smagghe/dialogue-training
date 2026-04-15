import styles from "../styles.module.scss";
import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { useTimeProgress } from "../hooks/useTimeProgress";

interface DialogueItemProps {
  item: {
    readingTime: number;
    name: string;
    dialogue: string;
    key: string;
  };
  readingText: {
    key: string;
  } | null;
  selectedCharacter: string | null;
  hideCharacterDialogue: boolean;
  muteSelectedCharacter: boolean;
  readSpecificDialogue: (dialogueItem: {
    name: string;
    dialogue: string;
    key: string;
  }) => void;
}

const DialogueItem = ({
  item,
  readingText,
  selectedCharacter,
  hideCharacterDialogue,
  muteSelectedCharacter,
  readSpecificDialogue
}: DialogueItemProps) => {
  const [showDisabledDialogue, setShowDisabledDialogue] = useState(false);
  
  const dialogueIsDisabled = (hideCharacterDialogue || muteSelectedCharacter) &&
  selectedCharacter != null &&
  item.name === selectedCharacter;
  
  const displayDialogue = !dialogueIsDisabled || showDisabledDialogue;
  
  // Handle progress tracking when the item is being read
  const { progress, start, stop } = useTimeProgress({ time: item.readingTime });

  useEffect(() => {
    if (readingText?.key === item.key && item.readingTime > 0) {
      start();
    } else {
      stop();
    }
  }, [readingText, item.key, item.readingTime]);

  const handleClick = () => {
    if(dialogueIsDisabled) {
      setShowDisabledDialogue(!showDisabledDialogue);
    } else {
      readSpecificDialogue(item);
    }
  };

  return (
    <button
      key={item.key}
      data-dialogue-key={item.key}
      className={`${styles.dialogueItem} ${
        readingText?.key === item.key ? styles.dialogueItemReading : ""
      } ${
        selectedCharacter != null && item.name === selectedCharacter
          ? styles.currentUserDialogue
          : ""
      }`}
      onClick={handleClick}
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
      {displayDialogue ? (
        <>
          <span className={styles.dialogueText}>{item.dialogue}</span>
          {item.readingTime > 0 && (
            <ProgressBar progress={progress} />
          )}
          {item.readingTime ? (
            <span className={styles.readingTime}>
              ⏱️ {item?.readingTime.toFixed(1)}s
            </span>
          ) : (
            ""
          )}
        </>
      ) : (
        <span className={styles.dialogueText}>
          <em style={{ color: "#999", fontStyle: "italic" }}>
            (Disabled)
          </em>
        </span>
      )}
    </button>
  );
};

export default DialogueItem;
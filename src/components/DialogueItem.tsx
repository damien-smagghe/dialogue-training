import styles from "../styles.module.scss";

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
  setHideCharacterDialogue?: (hide: boolean) => void;
}

const DialogueItem = ({
  item,
  readingText,
  selectedCharacter,
  hideCharacterDialogue,
  muteSelectedCharacter,
  readSpecificDialogue,
  setHideCharacterDialogue
}: DialogueItemProps) => {
  const handleDialogueClick = () => {
    // If this is a selected character's dialogue and hideCharacterDialogue is true,
    // toggle the hide state
    if (selectedCharacter != null &&
        item.name === selectedCharacter &&
        hideCharacterDialogue &&
        setHideCharacterDialogue) {
      setHideCharacterDialogue(!hideCharacterDialogue);
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
      onClick={handleDialogueClick}
      disabled={
        (hideCharacterDialogue || muteSelectedCharacter) &&
        selectedCharacter != null &&
        item.name === selectedCharacter
      }
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
      {hideCharacterDialogue &&
      selectedCharacter != null &&
      item.name === selectedCharacter ? (
        <span className={styles.dialogueText}>
          <em style={{ color: "#999", fontStyle: "italic" }}>
            (Disabled)
          </em>
        </span>
      ) : (
        <>
          <span className={styles.dialogueText}>{item.dialogue}</span>
          {item.readingTime ? (
            <span className={styles.readingTime}>
              ⏱️ {item?.readingTime.toFixed(1)}s
            </span>
          ) : (
            ""
          )}
        </>
      )}
    </button>
  );
};

export default DialogueItem;
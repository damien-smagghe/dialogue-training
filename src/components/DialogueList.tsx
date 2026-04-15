import styles from "../styles.module.scss";

interface DialogueListProps {
  currentDialoguePage: readonly {
    readingTime: number;
    name: string;
    dialogue: string;
    key: string;
  }[];
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
  dialogueListRef: React.RefObject<HTMLDivElement>;
  setHideCharacterDialogue?: (hide: boolean) => void;
}

const DialogueList = ({
  currentDialoguePage,
  readingText,
  selectedCharacter,
  hideCharacterDialogue,
  muteSelectedCharacter,
  readSpecificDialogue,
  dialogueListRef,
  setHideCharacterDialogue
}: DialogueListProps) => {
  const handleDialogueClick = (item: {
    name: string;
    dialogue: string;
    key: string;
  }) => {
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
    <div className={styles.dialogueList} ref={dialogueListRef}>
      {currentDialoguePage.map((item) => (
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
          onClick={() => handleDialogueClick(item)}
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
      ))}
    </div>
  );
};

export default DialogueList;
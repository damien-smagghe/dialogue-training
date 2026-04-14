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
  readSpecificDialogue: (dialogueItem: {
    name: string;
    dialogue: string;
    key: string;
  }) => void;
  dialogueListRef: React.RefObject<HTMLDivElement>;
}

const DialogueList = ({
  currentDialoguePage,
  readingText,
  selectedCharacter,
  hideCharacterDialogue,
  readSpecificDialogue,
  dialogueListRef
}: DialogueListProps) => {
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
          onClick={() => readSpecificDialogue(item)}
          disabled={
            hideCharacterDialogue &&
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
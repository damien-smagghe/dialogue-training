import styles from "./dialogueList.module.scss";
import DialogueItem from "./DialogueItem";

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
    <div  className={styles.dialogueListWrapper}>


    <div className={styles.dialogueList} ref={dialogueListRef}>
      {currentDialoguePage.map((item) => (
        <DialogueItem
          key={item.key}
          item={item}
          reading={readingText?.key === item.key}
          selectedCharacter={selectedCharacter}
          hideCharacterDialogue={hideCharacterDialogue}
          muteSelectedCharacter={false}
          readSpecificDialogue={readSpecificDialogue}
        />
      ))}
    </div>
    </div>
  );
};

export default DialogueList;
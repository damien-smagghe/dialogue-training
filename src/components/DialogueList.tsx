import styles from "../styles.module.scss";
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
  return (
    <div className={styles.dialogueList} ref={dialogueListRef}>
      {currentDialoguePage.map((item) => (
        <DialogueItem
          key={item.key}
          item={item}
          readingText={readingText}
          selectedCharacter={selectedCharacter}
          hideCharacterDialogue={hideCharacterDialogue}
          muteSelectedCharacter={muteSelectedCharacter}
          readSpecificDialogue={readSpecificDialogue}
          setHideCharacterDialogue={setHideCharacterDialogue}
        />
      ))}
    </div>
  );
};

export default DialogueList;
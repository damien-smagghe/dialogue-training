import styles from "../styles.module.scss";

interface PaginationControlsProps {
  currentPageNumber: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  hideCharacterDialogue: boolean;
  setHideCharacterDialogue: (hide: boolean) => void;
  muteSelectedCharacter: boolean;
  setMuteSelectedCharacter: (mute: boolean) => void;
}

const PaginationControls = ({
  currentPageNumber,
  totalPages,
  isFirstPage,
  isLastPage,
  goToPreviousPage,
  goToNextPage,
  hideCharacterDialogue,
  setHideCharacterDialogue,
  muteSelectedCharacter,
  setMuteSelectedCharacter
}: PaginationControlsProps) => {
  return (
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

      {/* New toggles for character dialogue and voice mute */}
      <div className={styles.controlsToggles}>
        <button
          className={`${styles.toggleButton} ${
            hideCharacterDialogue ? styles.toggleButtonActive : ""
          }`}
          onClick={() => setHideCharacterDialogue(!hideCharacterDialogue)}
          aria-pressed={hideCharacterDialogue}
        >
          Hide Character Dialogue
        </button>
        <button
          className={`${styles.toggleButton} ${
            muteSelectedCharacter ? styles.toggleButtonActive : ""
          }`}
          onClick={() => setMuteSelectedCharacter(!muteSelectedCharacter)}
          aria-pressed={muteSelectedCharacter}
        >
          Mute Selected Character
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
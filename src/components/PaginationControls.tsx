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
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={hideCharacterDialogue}
            onChange={(e) => setHideCharacterDialogue(e.target.checked)}
          />
          Hide Character Dialogue
        </label>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={muteSelectedCharacter}
            onChange={(e) => setMuteSelectedCharacter(e.target.checked)}
          />
          Mute Selected Character
        </label>
      </div>
    </div>
  );
};

export default PaginationControls;
import styles from "./stickyControls.module.scss";

interface StickyControlsProps {
  reading: boolean;
  handleStart: () => void;
  stop: () => void;
  currentPageNumber: number;
  totalPages: number;
  prevPageDisabled: boolean;
  nextPageDisabled: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

const StickyControls = ({
  currentPageNumber,
  totalPages,
  prevPageDisabled,
  nextPageDisabled,
  goToPreviousPage,
  goToNextPage,
  reading,
  handleStart,
  stop,
}: StickyControlsProps) => {
  return (
    <div className={styles.stickyControlsWrapper}>
      <div className={styles.stickyControls}>
        <button
          className={`${styles.button} ${styles.playButton}`}
          onClick={handleStart}
          disabled={reading}
        >
          {reading ? "Reading..." : "Play"}
        </button>
        <button
          className={`${styles.button} ${styles.stopButton}`}
          onClick={stop}
          disabled={!reading}
        >
          Stop
        </button>
      </div>
      <div className={styles.stickyControls}>
        <button
          className={styles.button}
          onClick={goToPreviousPage}
          disabled={prevPageDisabled}
        >
          ←
        </button>
        <div className={styles.pages}>{currentPageNumber}/{totalPages}</div>
        <button
          className={`${styles.button}`}
          onClick={goToNextPage}
          disabled={nextPageDisabled}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default StickyControls;

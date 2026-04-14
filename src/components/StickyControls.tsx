import styles from "../styles.module.scss";

interface StickyControlsProps {
  reading: boolean;
  handleStart: () => void;
  stop: () => void;
}

const StickyControls = ({ reading, handleStart, stop }: StickyControlsProps) => {
  return (
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
  );
};

export default StickyControls;
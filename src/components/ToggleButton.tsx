import styles from "./toggleButton.module.scss";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  ariaPressed?: boolean;
  children: any;
}

const ToggleButton = ({ isActive, onClick, children }: ToggleButtonProps) => {
  return (
    <label className={styles.switch}>
      <input
        checked={isActive}
        type="checkbox"
        className={styles.toggle}
        onChange={onClick}
      />
      <span className={styles.slider} />
      <span className={styles.cardSide} />
      <span className={styles.label}>{children}</span>
    </label>
  );
};

export default ToggleButton;

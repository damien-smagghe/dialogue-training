import styles from "../styles.module.scss";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  ariaPressed?: boolean;
}

const ToggleButton = ({
  isActive,
  onClick,
  label,
  ariaPressed
}: ToggleButtonProps) => {
  return (
    <button
      className={`${styles.toggleButton} ${isActive ? styles.toggleButtonActive : ""}`}
      onClick={onClick}
      aria-pressed={ariaPressed}
    >
      {label}
    </button>
  );
};

export default ToggleButton;
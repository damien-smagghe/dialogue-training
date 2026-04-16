import styles from "./header.module.scss";
import SettingsIcon from "./SettingsIcon.svg";
import type { ReadingMode } from "../types";

interface HeaderProps {
  setMuteSelectedCharacter: (mute: boolean) => void;
  onToggleSettings: () => void;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
}

const Header = ({ onToggleSettings, readingMode, setReadingMode }: HeaderProps) => {
  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReadingMode(event.target.value as ReadingMode);
  };

  return (
    <div className={styles.header}>
      <button
        className={styles.settings}
        onClick={() => onToggleSettings()}
        aria-label="Settings"
      >
        <SettingsIcon className={styles.settingsSvg} />
      </button>
      <div className={styles.title}>
        La bande à Bécède
      </div>
      <select
        className={styles.modeSelect}
        value={readingMode}
        onChange={handleModeChange}
        aria-label="Reading mode"
      >
        <option value="document">Simple lecture</option>
        <option value="training">Entraînement</option>
      </select>
    </div>
  );
};

export default Header;

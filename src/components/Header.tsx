import styles from "./header.module.scss";
import SettingsIcon from "./SettingsIcon.svg";

interface HeaderProps {
  setMuteSelectedCharacter: (mute: boolean) => void;
  onToggleSettings: () => void;
}

const Header = ({ onToggleSettings }: HeaderProps) => {
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
    </div>
  );
};

export default Header;

import styles from "./header.module.scss";
import ToggleButton from "./ToggleButton";
import SettingsIcon from  './SettingsIcon.svg'

interface HeaderProps {
  hideCharacterDialogue: boolean;
  setHideCharacterDialogue: (hide: boolean) => void;
  muteSelectedCharacter: boolean;
  setMuteSelectedCharacter: (mute: boolean) => void;
  onToggleSettings: () => void;
}

const Header = ({
  hideCharacterDialogue,
  setHideCharacterDialogue,
  muteSelectedCharacter,
  setMuteSelectedCharacter,
  onToggleSettings,
}: HeaderProps) => {
  return (
    <div className={styles.header}>
      <button
        className={styles.settings}
        onClick={() => onToggleSettings()}
        aria-label="Settings"
      >
        <SettingsIcon className={styles.settingsSvg} />
      </button>

      {/* New toggles for character dialogue and voice mute */}
      <div className={styles.controlsToggles}>
        <ToggleButton
          isActive={hideCharacterDialogue}
          onClick={() => setHideCharacterDialogue(!hideCharacterDialogue)}
          ariaPressed={hideCharacterDialogue}
        >
          Cacher mes répliques
        </ToggleButton>
        <ToggleButton
          isActive={muteSelectedCharacter}
          onClick={() => setMuteSelectedCharacter(!muteSelectedCharacter)}
          ariaPressed={muteSelectedCharacter}
        >
          Ne pas lire mes répliques
        </ToggleButton>
      </div>
    </div>
  );
};

export default Header;

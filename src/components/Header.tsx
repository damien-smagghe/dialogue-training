import styles from "./header.module.scss";
import ToggleButton from "./ToggleButton";

interface HeaderProps {
  currentPageNumber: number;
  totalPages: number;
  prevPageDisabled: boolean;
  nextPageDisabled: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  hideCharacterDialogue: boolean;
  setHideCharacterDialogue: (hide: boolean) => void;
  muteSelectedCharacter: boolean;
  setMuteSelectedCharacter: (mute: boolean) => void;
  onToggleSettings: () => void;
}

const Header = ({
  currentPageNumber,
  totalPages,
  prevPageDisabled,
  nextPageDisabled,
  goToPreviousPage,
  goToNextPage,
  hideCharacterDialogue,
  setHideCharacterDialogue,
  muteSelectedCharacter,
  setMuteSelectedCharacter,
  onToggleSettings,
}: HeaderProps) => {
  return (
    <div className={styles.header}>
      <button
        className={styles.voiceSelectorToggle}
        onClick={() => onToggleSettings()}
        aria-label="Settings"
      >
        {/* <SettingsIcon color="#3b82f6" /> */}
        <span style={{ marginLeft: "0.5rem", fontSize: "14px" }}>
          Voice & Character Settings
        </span>
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

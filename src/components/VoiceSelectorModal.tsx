import styles from "../styles.module.scss";
import ToggleButton from "./ToggleButton.tsx";

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: readonly string[];
  voices: readonly {
    name: string;
    lang: string;
  }[];
  voiceNameByCharacters: Record<string, string>;
  selectedCharacter: string | null;
  hideCharacterDialogue: boolean;
  handleCharacterVoiceChange: (
    character: string,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  setSelectedCharacter: (character: string | null) => void;
  setHideCharacterDialogue: (hide: boolean) => void;
  muteSelectedCharacter: boolean;
  setMuteSelectedCharacter: (mute: boolean) => void;
}

const VoiceSelectorModal = ({
  isOpen,
  onClose,
  characters,
  voices,
  voiceNameByCharacters,
  selectedCharacter,
  hideCharacterDialogue,
  handleCharacterVoiceChange,
  setSelectedCharacter,
  setHideCharacterDialogue,
  muteSelectedCharacter,
  setMuteSelectedCharacter,
}: VoiceSelectorModalProps) => {
  if (!isOpen) return null;

  const handleCharacterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedCharacter(event.target.value);
  };

  // Group voices by language for better UX
  const voicesByLanguage = voices.reduce(
    (acc, voice) => {
      if (!acc[voice.lang]) {
        acc[voice.lang] = [];
      }
      acc[voice.lang].push(voice);
      return acc;
    },
    {} as Record<string, typeof voices>,
  );

  return (
    <div className={styles.voiceSelectorModal}>
      <div className={styles.voiceSelectorModalContent}>
        <div className={styles.voiceSelectorModalHeader}>
          <h2>Paramètres</h2>
          <button
            className={styles.voiceSelectorModalClose}
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className={styles.voiceSelectorModalBody}>
          {/* Character Selection */}
          <div className={styles.voiceSelectorGroup}>
            <h3>Personnage principal</h3>
            <p className={styles.voiceSelectorDescription}>
              Choisissez le personnage que vous interprétez dans la pièce.
            </p>

            <select
              id="character-select"
              onChange={handleCharacterChange}
              value={selectedCharacter || ""}
              className={styles.voiceSelectorSelect}
            >
              <option key="null" value="">Choisissez un personnage</option>
              {characters.map((character) => (
                <option key={character} value={character}>
                  {character}
                </option>
              ))}
            </select>

            {/* Hide Dialogue Toggle */}
            <ToggleButton
              isActive={hideCharacterDialogue}
              onClick={() => setHideCharacterDialogue(!hideCharacterDialogue)}
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

          {/* Character Voice Selectors - Improved UX */}
          <div className={styles.voiceSelectorGroup}>
            <h3>Voix des personnages</h3>
            <p className={styles.voiceSelectorDescription}>
              Choisissez une voix pour chaque personnage afin de personnaliser
              votre expérience de lecture
            </p>

            <div className={styles.voiceSelectorGrid}>
              {characters.map((name) => (
                <div key={name} className={styles.voiceSelectorItem}>
                  <label className={styles.voiceSelectorLabel}>{name}</label>
                  <div className={styles.voiceSelectorSelectContainer}>
                    <select
                      onChange={(event) =>
                        handleCharacterVoiceChange(name, event)
                      }
                      value={voiceNameByCharacters[name]}
                      className={styles.voiceSelectorSelect}
                    >
                      <option value="">Choose a voice for {name}</option>
                      {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              className={`${styles.button} ${styles.footerModalButton}`}
              onClick={onClose}
              aria-label="Close settings"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelectorModal;

import styles from "../styles.module.scss";

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
  start: (key: string) => void;
  currentDialoguePage: readonly {
    name: string;
    dialogue: string;
    key: string;
  }[];
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
  start,
  currentDialoguePage,
}: VoiceSelectorModalProps) => {
  if (!isOpen) return null;

  const handleCharacterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedCharacter(event.target.value);
    if (currentDialoguePage.length > 0) {
      const [firstDialogueItem] = currentDialoguePage;
      start(firstDialogueItem.key);
    }
  };

  return (
    <div className={styles.voiceSelectorModal}>
      <div className={styles.voiceSelectorModalContent}>
        <div className={styles.voiceSelectorModalHeader}>
          <h2>Voice & Character Settings</h2>
          <button
            className={styles.voiceSelectorModalClose}
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>
        <div className={styles.voiceSelectorDropdown}>
          {/* Character Voice Selectors */}
          <div className={styles.voiceSelectorGroup}>
            <label>Character Voices:</label>
            {characters.map((name) => (
              <div key={name} className={styles.characterVoiceSelector}>
                <span>{name}:</span>
                <select
                  onChange={(event) => handleCharacterVoiceChange(name, event)}
                  value={voiceNameByCharacters[name]}
                >
                  <option value="">Select a French Voice for {name}</option>
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Character Selection */}
          <div className={styles.voiceSelectorGroup}>
            <label
              htmlFor="character-select"
              className={styles.characterSelection}
            >
              Selected Character:
            </label>
            <select
              id="character-select"
              onChange={handleCharacterChange}
              value={selectedCharacter || characters[0] || ""}
            >
              <option value="">Select a character to focus on</option>
              {characters.map((character) => (
                <option key={character} value={character}>
                  {character}
                </option>
              ))}
            </select>

            {/* Hide Dialogue Toggle */}
            <div style={{ marginTop: "10px" }}>
              <label style={{ fontSize: "14px", color: "#333" }}>
                <input
                  type="checkbox"
                  checked={hideCharacterDialogue}
                  onChange={(e) => setHideCharacterDialogue(e.target.checked)}
                />{" "}
                Hide dialogue text for {selectedCharacter || "no character"}
              </label>
            </div>
          </div>
          <button onClick={onClose} className={styles.button} type="button">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelectorModal;

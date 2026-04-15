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

  // Group voices by language for better UX
  const voicesByLanguage = voices.reduce((acc, voice) => {
    if (!acc[voice.lang]) {
      acc[voice.lang] = [];
    }
    acc[voice.lang].push(voice);
    return acc;
  }, {} as Record<string, typeof voices>);

  return (
    <div className={styles.voiceSelectorModal}>
      <div className={styles.voiceSelectorModalContent}>
        <div className={styles.voiceSelectorModalHeader}>
          <h2>Audio Settings</h2>
          <button
            className={styles.voiceSelectorModalClose}
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className={styles.voiceSelectorModalBody}>
          {/* Character Voice Selectors - Improved UX */}
          <div className={styles.voiceSelectorGroup}>
            <h3>Character Voices</h3>
            <p className={styles.voiceSelectorDescription}>
              Select a voice for each character to personalize your reading experience
            </p>

            <div className={styles.voiceSelectorGrid}>
              {characters.map((name) => (
                <div key={name} className={styles.voiceSelectorItem}>
                  <label className={styles.voiceSelectorLabel}>
                    {name}
                  </label>
                  <div className={styles.voiceSelectorSelectContainer}>
                    <select
                      onChange={(event) => handleCharacterVoiceChange(name, event)}
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

          {/* Character Selection */}
          <div className={styles.voiceSelectorGroup}>
            <h3>Focus Character</h3>
            <p className={styles.voiceSelectorDescription}>
              Select which character's dialogue you want to focus on
            </p>

            <div className={styles.voiceSelectorSelectContainer}>
              <select
                id="character-select"
                onChange={handleCharacterChange}
                value={selectedCharacter || characters[0] || ""}
                className={styles.voiceSelectorSelect}
              >
                <option value="">Select a character to focus on</option>
                {characters.map((character) => (
                  <option key={character} value={character}>
                    {character}
                  </option>
                ))}
              </select>
            </div>

            {/* Hide Dialogue Toggle */}
            <div className={styles.voiceSelectorToggleContainer}>
              <label className={styles.voiceSelectorLabel}>
                <input
                  type="checkbox"
                  checked={hideCharacterDialogue}
                  onChange={(e) => setHideCharacterDialogue(e.target.checked)}
                />{" "}
                Hide dialogue text for {selectedCharacter || "no character"}
              </label>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.voiceSelectorGroup}>
            <h3>Quick Actions</h3>
            <div className={styles.voiceSelectorQuickActions}>
              <button
                className={styles.voiceSelectorQuickAction}
                onClick={() => {
                  // Reset all voices to default
                  characters.forEach(character => {
                    handleCharacterVoiceChange(character, { target: { value: '' } } as any);
                  });
                  setSelectedCharacter(null);
                  setHideCharacterDialogue(false);
                }}
              >
                Reset to Defaults
              </button>
              <button
                className={styles.voiceSelectorQuickAction}
                onClick={() => {
                  // Apply to all characters
                  const defaultVoice = voices[0]?.name || '';
                  characters.forEach(character => {
                    handleCharacterVoiceChange(character, { target: { value: defaultVoice } } as any);
                  });
                }}
              >
                Apply to All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelectorModal;
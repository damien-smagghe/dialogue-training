// Utility function to add keys to dialogues
export const addKeysToDialogues = (dialogues: readonly { name: string; dialogue: string }[][]): any => {
  return dialogues.map((page, pageIndex) => {
    return page.map((dialogue, dialogueIndex) => {
      // Create a unique key based on page index, dialogue index, and character name
      const key = `page-${pageIndex}-dialogue-${dialogueIndex}-${dialogue.name.toLowerCase().replace(/\s+/g, '-')}`;
      return {
        ...dialogue,
        key
      };
    });
  });
};
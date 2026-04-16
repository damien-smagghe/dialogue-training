interface Dialogue {
  dialogue: string;
  name: string;
  key: string;
  readingTime: number;
}

/**
 * Groups dialogues based on the appearance of selectedCharacter.
 * A new group is created when there are more than 8 consecutive dialogues
 * without the selectedCharacter appearing.
 *
 * @param dialogues - 2D array of dialogues (pages)
 * @param selectedCharacter - The character name to group by
 * @param gapThreshold - Number of consecutive dialogues without selectedCharacter to trigger a new group (default: 8)
 * @returns 2D array of grouped dialogues (each group contains an array of dialogues)
 */
export function groupDialoguesByCharacter(
  dialogues: readonly Dialogue[][],
  selectedCharacter: string | null,
  gapThreshold: number = 15,
  maxItemsBetweenSelectedCharacter: number = 3,
): Dialogue[][] {
  // Flatten all dialogues from all pages
  const flatDialogues = dialogues.flat();

  if (!selectedCharacter) {
    // No selected character: return all dialogues as a single group
    return [flatDialogues];
  }

  let startGroup = false;
  let firstIndex = 0;
  let consecutiveWithoutCharacter = 0;
  return flatDialogues.reduce((acc, dialogue, index) => {
    const nextDialogueNames = [flatDialogues[index + 1]?.name, dialogue.name];
    if (!startGroup && nextDialogueNames.includes(selectedCharacter)) {
      startGroup = true;
      firstIndex = index;
      return acc;
    }
    const hasSelectedCharacter = dialogue.name === selectedCharacter;
    consecutiveWithoutCharacter = hasSelectedCharacter
      ? 0
      : consecutiveWithoutCharacter + 1;

    if (startGroup && consecutiveWithoutCharacter > gapThreshold) {
      startGroup = false;
      const currentGroup = flatDialogues.slice(
        firstIndex,
        index - gapThreshold,
      );
      return [
        ...acc,
        currentGroup.filter((_, index) => {
          const nextDialogues = currentGroup
            .slice(index, index + 1 + maxItemsBetweenSelectedCharacter)
            .map(({ name }) => name);
          return nextDialogues.includes(selectedCharacter) || index === 0;
        }),
      ];
    }

    return acc;
  }, [] as Dialogue[][]);

  // const groups: Dialogue[][] = [];
  // let currentGroup: Dialogue[] = [];
  // let consecutiveWithoutCharacter = 0;
  // let hasSelectedCharacter = false

  // for (const dialogue of flatDialogues) {
  //   if (dialogue.name === selectedCharacter) {
  //     // Reset counter when selected character appears
  //     consecutiveWithoutCharacter = 0;
  //     hasSelectedCharacter = true
  //     currentGroup.push(dialogue);
  //   } else {
  //     consecutiveWithoutCharacter++;
  //     currentGroup.push(dialogue);

  //     // Create new group when threshold exceeded
  //     if (consecutiveWithoutCharacter > gapThreshold) {
  //       if (hasSelectedCharacter && currentGroup.length > 0) {
  //         groups.push(currentGroup);
  //       }
  //       currentGroup = [];
  //       consecutiveWithoutCharacter = 0;
  //       hasSelectedCharacter = false
  //     }
  //   }
  // }

  // // Push remaining dialogues
  // if (currentGroup.length > 0) {
  //   groups.push(currentGroup);
  // }

  // return groups;
}

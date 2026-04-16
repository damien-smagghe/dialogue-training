// Types for dialogue application

export interface Dialogue {
  name: string
  dialogue: string
  key: string
}

export interface DialoguePage {
  dialogues: Dialogue[]
}

export type Dialogues = DialoguePage[][]

export interface EncryptedDialogueData {
  salt: string
  iv: string
  ciphertext: string
  encVersion: string
}

export type ReadingMode = "document" | "training";

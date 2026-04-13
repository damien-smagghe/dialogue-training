import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./MainPage";
import DialoguesDecrypt from "./components/DialoguesDecrypt";
import { useState, useEffect } from "react";

const DecryptedApp = () => {
  // Decrypt the encrypted dialogues
  const decryptDialogues = async () => {
    try {
      const response = await fetch("./src/dialogues.enc.json");
      const encryptedData = await response.json();

      // Helper to convert hex to Uint8Array
      const hexToBytes = (hex) => {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
      };

      // Generate key from password using stored salt
      const crypto = window.crypto || window.msCrypto;
      const encoder = new TextEncoder();

      // Import password as key material
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode("temmppp"),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
      );

      // Derive key
      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: hexToBytes(encryptedData.salt),
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
      );

      // Decrypt
      const decipher = crypto.subtle.decrypt(
        { name: "AES-GCM", iv: hexToBytes(encryptedData.iv) },
        key,
        hexToBytes(encryptedData.ciphertext),
      );

      const decryptedText = await decipher;
      console.log("decryptedText ->", decryptedText);
      const dialogueData = JSON.parse(decryptedText);

      // Extract unique characters from dialogues
      const characters = new Set();
      for (const page of dialogueData) {
        for (const dialogue of page) {
          characters.add(dialogue.name);
        }
      }

      const charactersArray = Array.from(characters).sort();

      // Update with characters
      dialogueData.characters = charactersArray;

      console.log("Dialogues decrypted successfully:", dialogueData);
      setDialogues(dialogueData);
      setLoading(false);
    } catch (err) {
      console.error("Decryption error:", err);
      setDecryptError(err.message);
      setLoading(false);
    }
  };

  // State to hold decrypted dialogues
  const [dialogues, setDialogues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decryptError, setDecryptError] = useState("");

  useEffect(() => {
    // Auto-decrypt when component mounts
    decryptDialogues();
  }, []);

  const handleDecryptionSuccess = (decryptedDialogues) => {
    console.log("Dialogues decrypted successfully via DialoguesDecrypt");
    // Update dialogues if they exist
    if (decryptedDialogues) {
      setDialogues(decryptedDialogues);
    }
  };

  const handleDecryptionError = (message) => {
    console.error("Decryption error via DialoguesDecrypt:", message);
    // Only show error if decryption failed both ways
    if (!decryptError) {
      setDecryptError(message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading...</h2>
        <p>Decrypting dialogues (please enter your password)</p>
        {decryptError && <p style={{ color: "red" }}>{decryptError}</p>}
      </div>
    );
  }

  if (!dialogues) {
    return (
      <div style={{ padding: "2rem" }}>
        <DialoguesDecrypt
          onSuccess={handleDecryptionSuccess}
          onError={handleDecryptionError}
        />
      </div>
    );
  }

  return (
    <StrictMode>
      <MainPage dialogues={dialogues.dialogues} characters={dialogues.characters} />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<DecryptedApp />);

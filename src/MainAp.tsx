import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./MainPage";
import DialoguesDecrypt from "./components/DialoguesDecrypt";
import { useState, useEffect } from "react";
import useSession from "../hooks/useSession.ts";
import SimpleCrypto from "simple-crypto-js";
import encryptedFile from "./dialogues.enc.json";

const DecryptedApp = () => {
  const { session, updateSession } = useSession();

  // State to hold decrypted dialogues
  const [dialogues, setDialogues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decryptError, setDecryptError] = useState("");

  // Decrypt the encrypted dialogues
  const decryptDialogues = async () => {
    try {
      console.log('session ->', session)
      const crypto = new SimpleCrypto(session.password);

      // Encrypted data from imported file
      const encryptedData = encryptedFile.data;
      // Decrypt (result is a Promise that resolves to an array)
      const dialoguesData = await crypto.decrypt(
        encryptedData,
        "SHA-256",
        100000,
      );
      // Extract unique characters
      const characters = new Set<string>();
      for (const page of dialoguesData) {
        for (const dialogue of page) {
          if (dialogue.name) {
            characters.add(dialogue.name);
          }
        }
      }

      console.log("Dialogues decrypted successfully:", dialoguesData);
      setDialogues({
        dialogues: dialoguesData,
        characters: Array.from(characters).sort(),
      });
      setLoading(false);
    } catch (err) {
      console.error("Decryption error:", err);
      setDecryptError(err.message);
      setLoading(false);
    }
  };

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
      <MainPage
        dialogues={dialogues.dialogues}
        characters={dialogues.characters}
      />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<DecryptedApp />);

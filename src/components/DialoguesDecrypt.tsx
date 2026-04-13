import { useState, useEffect, useCallback } from "react";
import SimpleCrypto from "simple-crypto-js";
import encryptedFile from "../dialogues.enc.json";
import styles from "./DialoguesDecrypt.module.css";
import useSession from "../../hooks/useSession.ts";

// ============================================
// Types
// ============================================

interface DialoguesData {
  dialogues: unknown[];
  characters: string[];
}

interface DecryptComponentProps {
  onSuccess: (data: DialoguesData) => void;
  onError: (message: string) => void;
  onClose?: () => void;
}

// ============================================
// Sub-components
// ============================================

interface DecryptButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

function DecryptButton({
  onClick,
  disabled,
  isLoading,
  children,
}: DecryptButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={styles.button}
      type="button"
    >
      {isLoading ? "Decrypting..." : children}
    </button>
  );
}

interface ProgressDisplayProps {
  message: string;
}

function ProgressDisplay({ message }: ProgressDisplayProps) {
  return (
    <p className={styles.progress} role="status" aria-live="polite">
      {message}
    </p>
  );
}

interface ErrorDisplayProps {
  message: string;
}

function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <p className={styles.error} role="alert">
      {message}
    </p>
  );
}

interface CloseButtonProps {
  onClick: () => void;
}

interface ModalButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}

function ModalButton({
  onClick,
  variant = "primary",
  children,
  disabled,
  isLoading,
}: ModalButtonProps) {
  const baseStyles: React.CSSProperties = {
    padding: "0.625rem 1.25rem",
    borderRadius: "0.375rem",
    border: variant === "primary" ? "none" : "1px solid #d1d5db",
    backgroundColor: variant === "primary" ? "#3b82f6" : "white",
    color: variant === "primary" ? "white" : "#374151",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
    whiteSpace: "nowrap",
  };

  const hoverStyles: React.CSSProperties =
    variant === "primary"
      ? { backgroundColor: "#2563eb" }
      : { backgroundColor: "#f9fafb", borderColor: "#9ca3af" };

  const disabledStyles: React.CSSProperties = {
    opacity: 0.6,
    cursor: "not-allowed",
    backgroundColor: "#e5e7eb",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        ...baseStyles,
        ...(disabled || isLoading ? disabledStyles : {}),
        ...hoverStyles,
      }}
      type="button"
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
}

// ============================================
// Main Component
// ============================================

function DialoguesDecrypt({
  onSuccess,
  onError,
}: DecryptComponentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const [password, setPassword] = useState("");
  const [showModal] = useState(true);
  const { updateSession } = useSession();

  // Encrypted data from imported file
  const encryptedData = encryptedFile.data;

  // Auto-focus password input on mount
  useEffect(() => {
    if (showModal) {
      const input = document.getElementById(
        "dialogue-password",
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  }, [showModal]);

  // Handle decryption
  const handleDecrypt = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProgress("Decrypting...");

    try {
      if (!password.trim() || !encryptedData) {
        throw new Error("Please enter your password");
      }

      setProgress("Decrypting with password...");

      // Create crypto instance with password
      const crypto = new SimpleCrypto(password);

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

      updateSession({ password });

      onSuccess({
        dialogues: dialoguesData,
        characters: Array.from(characters).sort(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to decrypt";
      onError(message);
      setError(message);
    } finally {
      setLoading(false);
      setProgress("");
    }
  }, [password, encryptedData, onSuccess, onError]);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !loading) {
        handleDecrypt();
      }
    },
    [loading, handleDecrypt],
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  if (!showModal) {
    return null;
  }

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <header className={styles.modalHeader}>
          <h1 id="modal-title" className={styles.modalTitle}>
            Authentification
          </h1>
        </header>

        {/* Body */}
        <div className={styles.modalBody}>
          {error && <ErrorDisplay message={error} />}

          {progress && <ProgressDisplay message={progress} />}

          <div className={styles.inputGroup}>
            <input
              id="dialogue-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mot de passe"
              disabled={!encryptedData || loading}
              className={styles.input}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.modalFooter}>
          <DecryptButton
            onClick={handleDecrypt}
            disabled={!encryptedData || loading}
            isLoading={loading}
          >
            Envoyer
          </DecryptButton>
        </footer>
      </div>
    </div>
  );
}

export default DialoguesDecrypt;

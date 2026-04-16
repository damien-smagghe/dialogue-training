import { useRef, useState } from "react";
import type { ReadingMode } from "../src/types";

const SESSION_KEY = "dialogue-training-session";

const useSession = () => {
  const [session, setSession] = useState<{
    password: string | undefined; // The password for the session.
    voiceNameByCharacters: Record<string, string>; // A map of character names to their respective voice names.
    selectedCharacter: string | undefined; // The currently selected character in the session.
    readingMode: ReadingMode; // The current reading mode (document or training).
  }>({
    password: undefined,
    voiceNameByCharacters: {},
    selectedCharacter: undefined,
    readingMode: "document",
  });

  const loaded = useRef(false);
  console.log("window ->", window.location);
  let hashPassword = decodeURIComponent(window.location.hash);
  hashPassword = hashPassword.slice(1);

  const sessionString = localStorage.getItem(SESSION_KEY);
  if (sessionString && !loaded.current) {
    setSession(JSON.parse(sessionString));
  } else if (hashPassword && !loaded.current) {
    setSession({ ...session, password: hashPassword });
  }
  loaded.current = true;
  const updateSession = (newSession: {
    password?: string;
    voiceNameByCharacters?: Record<string, string | undefined>;
    selectedCharacter?: string | null;
    readingMode?: ReadingMode;
  }) => {
    const resulSession = { ...session, ...newSession };
    setSession(resulSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(resulSession));
  };
  return { session, updateSession };
};

export default useSession;

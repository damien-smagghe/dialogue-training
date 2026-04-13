import { useRef, useState } from "react";

const SESSION_KEY = "dialogue-training-session";

const useSession = () => {
  const [session, setSession] = useState({
    password: undefined,
    voiceNameByCharacters: {},
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
  }) => {
    const resulSession = { ...session, ...newSession };
    setSession(resulSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(resulSession));
  };
  return { session, updateSession };
};

export default useSession;

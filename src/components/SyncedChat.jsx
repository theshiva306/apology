import { useEffect, useState } from "react";
import Chat from "../pages/Chat.jsx";

export default function SyncedChat() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleSync = () => setVersion((v) => v + 1);
    window.addEventListener("chat-firebase-updated", handleSync);
    return () => window.removeEventListener("chat-firebase-updated", handleSync);
  }, []);

  return <Chat key={version} />;
}

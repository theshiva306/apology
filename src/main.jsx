import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PasswordGate, { isUnlocked } from "./components/PasswordGate.jsx";
import "./styles/main.css";
import "./styles/password-gate.css";

function Root() {
  const [unlocked, setUnlocked] = useState(isUnlocked());

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

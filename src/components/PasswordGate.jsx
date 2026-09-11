import { useCallback, useState } from "react";

const CORRECT_PASSWORD = "kittyloveszolo";
const STORAGE_KEY = "site-unlocked-v1";

function normalize(v) {
  return v.trim().toLowerCase();
}

// Hint tiers based on how many wrong attempts have been made.
function getHint(attempts) {
  if (attempts >= 4) return "_ _ _ _ _ loves _ _ _ _ _";
  if (attempts >= 2) return "not your nicknames this time";
  return "nicknames";
}

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showWrong, setShowWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (normalize(value) === CORRECT_PASSWORD) {
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        onUnlock();
        return;
      }

      setAttempts((a) => a + 1);
      setShowWrong(true);
      setShowHint(false);
      setShaking(true);
      setValue("");
      window.setTimeout(() => setShaking(false), 420);
    },
    [value, onUnlock]
  );

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    setShowWrong(false);
  }, []);

  const toggleHint = useCallback(() => {
    setShowHint((h) => !h);
  }, []);

  return (
    <div className="gate-shell">
      <div className="gate-glow" aria-hidden="true" />

      <form className={`gate-card ${shaking ? "is-shaking" : ""}`} onSubmit={handleSubmit}>
        <span className="gate-icon" aria-hidden="true">
          &#9825;
        </span>

        <h1 className="gate-title">enter password to open</h1>

        <input
          type="password"
          className="gate-input"
          value={value}
          onChange={handleChange}
          placeholder="password"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Password"
          autoFocus
        />

        <button type="submit" className="gate-submit">
          unlock
        </button>

        <div className="gate-feedback" role="status" aria-live="polite">
          {showWrong && <p className="gate-wrong">wrong password</p>}

          <button type="button" className="gate-hint-btn" onClick={toggleHint}>
            {showHint ? "hide hint" : "need a hint?"}
          </button>

          {showHint && <p className="gate-hint-text">{getHint(attempts)}</p>}
        </div>
      </form>
    </div>
  );
}

export function isUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

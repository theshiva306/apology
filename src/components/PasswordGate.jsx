import { useCallback, useState } from "react";

const CORRECT_PASSWORD = "kittyloveszolo";
const STORAGE_KEY = "site-unlocked-v1";

function normalize(v) {
  return v.trim().toLowerCase();
}

// Hint tiers based on how many wrong attempts have been made.
// No hint is shown until the user has failed twice.
function getHint(attempts) {
  if (attempts >= 4) return "_ _ _ _ _ loves _ _ _ _ _";
  if (attempts >= 2) return "Hint: nicknames";
  return null;
}

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showWrong, setShowWrong] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (normalize(value) === CORRECT_PASSWORD) {
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        onUnlock();
        return;
      }

      setAttempts((a) => a + 1);
      setShowWrong(true);
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

  const toggleShowPassword = useCallback(() => {
    setShowPassword((s) => !s);
  }, []);

  return (
    <div className="gate-shell">
      <div className="gate-glow" aria-hidden="true" />

      <form className={`gate-card ${shaking ? "is-shaking" : ""}`} onSubmit={handleSubmit}>
        <span className="gate-icon" aria-hidden="true">
          &#9825;
        </span>

        <h1 className="gate-title">Enter password to continue</h1>

        <div className="gate-hint-row" aria-live="polite">
          {getHint(attempts) && <p className="gate-hint-text">{getHint(attempts)}</p>}
        </div>

        <div className="gate-input-wrap">
          <input
            type={showPassword ? "text" : "password"}
            className="gate-input"
            value={value}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            aria-label="Password"
            autoFocus
          />
          <button
            type="button"
            className="gate-eye-btn"
            onClick={toggleShowPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="21" x2="21" y2="3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <button type="submit" className="gate-submit">
          Unlock
        </button>

        <div className="gate-feedback" role="status" aria-live="polite">
          {showWrong && <p className="gate-wrong">Incorrect password. Please try again.</p>}
        </div>
      </form>
    </div>
  );
}

export function isUnlocked() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

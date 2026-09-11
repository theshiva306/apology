// Firebase-backed chat store.
// Keeps the old localStorage cache so the chat still has something to render
// immediately, then synchronizes the same message list through Realtime Database.

import { onValue, ref, set } from "firebase/database";
import { authReady, db } from "../firebase.js";
import { initialChatMsgs } from "../data/chatMsgs.js";

const STORAGE_KEY = "chat-msgs-v1";
const CHAT_PATH = "chat/messages";

let firebaseStarted = false;
let lastSyncedJson = null;

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return initialChatMsgs;
}

function writeLocal(msgs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); } catch {}
}

function startFirebaseSync() {
  if (firebaseStarted) return;
  firebaseStarted = true;

  authReady
    .then(() => {
      const messagesRef = ref(db, CHAT_PATH);

      onValue(messagesRef, async (snapshot) => {
        const remote = snapshot.val();

        // First client seeds the database from the existing local chat.
        if (!remote) {
          const seed = readLocal();
          lastSyncedJson = JSON.stringify(seed);
          try { await set(messagesRef, seed); } catch (error) { console.error("Firebase chat seed failed", error); }
          return;
        }

        const msgs = Array.isArray(remote)
          ? remote
          : Object.values(remote).filter(Boolean);
        const json = JSON.stringify(msgs);

        if (json === lastSyncedJson) return;
        lastSyncedJson = json;

        const localJson = JSON.stringify(readLocal());
        writeLocal(msgs);

        // Chat.jsx is intentionally kept unchanged. The small wrapper listens
        // for this event and remounts it so the existing UI picks up the remote data.
        if (json !== localJson) {
          window.dispatchEvent(new Event("chat-firebase-updated"));
        }
      }, (error) => {
        console.error("Firebase chat listener failed", error);
      });
    })
    .catch((error) => {
      console.error("Firebase anonymous auth failed", error);
    });
}

export function loadMsgs() {
  const msgs = readLocal();
  startFirebaseSync();
  return msgs;
}

export function saveMsgs(msgs) {
  writeLocal(msgs);
  const json = JSON.stringify(msgs);
  lastSyncedJson = json;

  authReady
    .then(() => set(ref(db, CHAT_PATH), msgs))
    .catch((error) => console.error("Firebase chat save failed", error));
}

export function createMsg({ text, replyTo = null, authorId = "you", authorName = "you" }) {
  const now = new Date().toISOString();
  return {
    id: `c${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    from: authorId,
    authorId,
    authorName,
    text: text.trim(),
    at: now,
    createdAt: now,
    replyTo,
    updatedAt: null,
    deletedAt: null,
  };
}

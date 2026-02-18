function readUsers() {
  try { return JSON.parse(localStorage.getItem("users") || "[]"); }
  catch { return []; }
}

function writeUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export async function registerUser(email, password) {
  const e = email.trim().toLowerCase();
  const p = password.trim();
  if (!e || !p) throw new Error("Missing");
  const users = readUsers();
  if (users.some(u => u.email === e)) throw new Error("Exists");
  const newUser = { id: Date.now(), email: e, password: p, name: e.split("@")[0] };
  writeUsers([newUser, ...users]);
  return { ok: true };
}

export async function loginUser(email, password) {
  const e = email.trim().toLowerCase();
  const p = password.trim();
  const users = readUsers();
  const found = users.find(u => u.email === e && u.password === p);

  if (!found) {
    if (e === "test@test.com" && p === "1234") {
      localStorage.setItem("token", "fake_token_123");
      localStorage.setItem("me", JSON.stringify({ name: "Rihards", email: e }));
      return { token: "fake_token_123", user: { name: "Rihards" } };
    }
    throw new Error("Invalid credentials");
  }

  localStorage.setItem("token", "fake_token_" + found.id);
  localStorage.setItem("me", JSON.stringify({ name: found.name, email: found.email }));
  return { token: "fake_token_" + found.id, user: { name: found.name } };
}

export async function getCurrentUser() {
  const me = localStorage.getItem("me");
  if (!me) throw new Error("Not logged in");
  return JSON.parse(me);
}

function readItems(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}

function writeItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

export async function getAnnouncements() {
  return readItems("announcements");
}

export async function createAnnouncement(item) {
  const items = readItems("announcements");
  const newItem = { id: Date.now(), ...item };
  writeItems("announcements", [newItem, ...items]);
  return newItem;
}

export async function getHomework() {
  return readItems("homework");
}

export async function createHomework(item) {
  const items = readItems("homework");
  const newItem = { id: Date.now(), ...item };
  writeItems("homework", [newItem, ...items]);
  return newItem;
}

export async function getLessons() {
  const saved = readItems("lessons");
  if (saved.length) return saved;

  const seed = [
    { id: 1, day: "Mon", time: "09:10", subject: "Math", room: "210" },
    { id: 2, day: "Mon", time: "10:00", subject: "English", room: "105" },
    { id: 3, day: "Tue", time: "09:10", subject: "IT", room: "301" }
  ];
  writeItems("lessons", seed);
  return seed;
}
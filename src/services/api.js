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

export async function getMessages() {
  const saved = readItems("messages");
  if (saved.length) return saved;

  const seed = [
    {
      id: 1,
      from: "Stepanova Jeļena",
      to: "Tu",
      subject: "Mājasdarbs par Conditionals",
      body: "Lūdzu atkārtot 1st, 2nd un 3rd conditionals pirms nākamās stundas.",
      read: false,
      createdAt: Date.now() - 1000 * 60 * 60 * 6,
    },
    {
      id: 2,
      from: "Medvedevs Vladislavs",
      to: "Tu",
      subject: "Programmēšanas tehnoloģijas stunda",
      body: "Nākamajā nodarbībā turpināsim darbu ar praktisko uzdevumu.",
      read: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
  ];
  writeItems("messages", seed);
  return seed;
}

export async function createMessage(item) {
  const items = readItems("messages");
  const newItem = {
    id: Date.now(),
    from: "Tu",
    to: item.to?.trim() || "Skolotājs",
    subject: item.subject?.trim() || "(Bez temata)",
    body: item.body?.trim() || "",
    read: true,
    createdAt: Date.now(),
  };
  writeItems("messages", [newItem, ...items]);
  return newItem;
}

export async function toggleMessageRead(id) {
  const items = readItems("messages");
  const next = items.map((m) => (m.id === id ? { ...m, read: !m.read } : m));
  writeItems("messages", next);
  return next.find((m) => m.id === id);
}

export async function deleteMessage(id) {
  const items = readItems("messages");
  const next = items.filter((m) => m.id !== id);
  writeItems("messages", next);
  return { ok: true };
}
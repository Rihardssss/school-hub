const API = "/api";

export async function registerUser(email, password) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Register failed");
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Invalid credentials");
  localStorage.setItem("token", data.token);
  localStorage.setItem("me", JSON.stringify(data.user));
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API}/me`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Not logged in");
  return data;
}

export async function getAnnouncements() {
  const res = await fetch(`${API}/announcements`);
  return res.json();
}

export async function createAnnouncement(item) {
  const res = await fetch(`${API}/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });
  return res.json();
}

export async function getHomework() {
  const res = await fetch(`${API}/homework`);
  return res.json();
}

export async function createHomework(item) {
  const res = await fetch(`${API}/homework`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });
  return res.json();
}

export async function getLessons() {
  const res = await fetch(`${API}/lessons`);
  return res.json();
}

export async function getMessages() {
  const res = await fetch(`${API}/messages`);
  return res.json();
}

export async function createMessage(item) {
  const res = await fetch(`${API}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });
  return res.json();
}

export async function deleteMessage(id) {
  const res = await fetch(`${API}/messages/${id}`, {
    method: "DELETE"
  });
  return res.json();
}

export async function toggleMessageRead(id) {
  const res = await fetch(`${API}/messages/${id}/toggle-read`, {
    method: "PATCH"
  });
  return res.json();
}
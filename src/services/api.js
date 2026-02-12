export async function loginUser(email, password) {
  if (email === "test@test.com" && password === "1234") {
    return { token: "fake_token_123", user: { name: "Rihards" } };
  }
  throw new Error("Invalid credentials");
}

export async function getHomework() {
  return [
    { id: 1, subject: "Math", title: "p.45 uzd.3" },
    { id: 2, subject: "English", title: "Essay" }
  ];
}

export async function getAnnouncements() {
  return [
    { id: 1, title: "Math test on Friday" },
    { id: 2, title: "Bring sports clothes" }
  ];
}

export async function getLessons() {
  return [
    { id: 1, day: "Mon", time: "09:10", subject: "Math", room: "210" },
    { id: 2, day: "Mon", time: "10:00", subject: "English", room: "105" },
    { id: 3, day: "Tue", time: "09:10", subject: "IT", room: "301" }
  ];
}
export async function createHomework(item) {
  return { id: Date.now(), ...item };
}
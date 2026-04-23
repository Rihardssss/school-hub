const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

let users = [];
let homework = [];
let announcements = [];
let messages = [];

const swaggerDocument = require("./swagger.json");

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json(swaggerDocument);
});

function renderSwaggerPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SchoolHub API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        url: "/api-docs.json?ts=" + Date.now(),
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
}

app.get("/endpoints", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.send(renderSwaggerPage());
});

app.get("/endpoints/", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.send(renderSwaggerPage());
});

app.use("/project-endpoints", (req, res) => {
  res.redirect(301, "/endpoints/");
});

app.post("/api/register", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = (req.body.password || "").trim();

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const user = {
    id: Date.now(),
    email,
    password,
    name: email.split("@")[0]
  };

  users.unshift(user);
  res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = (req.body.password || "").trim();

  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) {
    if (email === "test@test.com" && password === "1234") {
      return res.json({
        token: "fake_token_123",
        user: { name: "Rihards", email }
      });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: "fake_token_" + found.id,
    user: { name: found.name, email: found.email }
  });
});

app.get("/api/me", (req, res) => {
  res.json({ name: "Rihards", email: "test@test.com" });
});

app.get("/api/announcements", (req, res) => {
  res.json(announcements);
});

app.post("/api/announcements", (req, res) => {
  const item = { id: Date.now(), ...req.body };
  announcements.unshift(item);
  res.json(item);
});

app.get("/api/homework", (req, res) => {
  res.json(homework);
});

app.post("/api/homework", (req, res) => {
  const item = { id: Date.now(), ...req.body };
  homework.unshift(item);
  res.json(item);
});

app.get("/api/lessons", (req, res) => {
  const seed = [
    { id: 1, day: "Mon", time: "09:10", subject: "Math", room: "210" },
    { id: 2, day: "Mon", time: "10:00", subject: "English", room: "105" },
    { id: 3, day: "Tue", time: "09:10", subject: "IT", room: "301" }
  ];
  res.json(seed);
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const item = {
    id: Date.now(),
    from: "Tu",
    to: req.body.to || "Skolotājs",
    subject: req.body.subject || "(Bez temata)",
    body: req.body.body || "",
    read: true,
    createdAt: Date.now()
  };
  messages.unshift(item);
  res.json(item);
});

app.patch("/api/messages/:id/toggle-read", (req, res) => {
  const id = Number(req.params.id);
  const message = messages.find((m) => m.id === id);
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }
  message.read = !message.read;
  res.json(message);
});

app.delete("/api/messages/:id", (req, res) => {
  const id = Number(req.params.id);
  messages = messages.filter((m) => m.id !== id);
  res.json({ ok: true });
});

const distCandidates = [
  path.join(__dirname, "dist"),
  path.join(__dirname, "..", "dist")
];
const distPath = distCandidates.find((candidate) => fs.existsSync(candidate));

if (distPath) {
  app.use(express.static(distPath));

  app.get("/{*any}", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/endpoints")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
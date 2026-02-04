import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({
  contentSecurityPolicy: false // keep simple for now; we can harden later
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Health check (Render)
app.get("/health", (req, res) => res.status(200).send("ok"));

// Main public link route
// Example: https://forms-sbx.navitascredit.com/f/<token>
app.get("/f/:token", (req, res) => {
  // Serve a single-page app, token read by JS from URL
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Optional: support query-string tokens too
// https://forms-sbx.navitascredit.com/?token=<token>
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
 * Submit endpoint (Render -> Salesforce will be implemented next)
 * For now, it just echoes back the payload so you can test UI.
 */
app.post("/api/submit", async (req, res) => {
  const { token, payload } = req.body || {};
  if (!token) return res.status(400).json({ ok: false, message: "Missing token." });
  if (!payload) return res.status(400).json({ ok: false, message: "Missing payload." });

  // TODO: Call Salesforce endpoint (next step)
  // Example: POST to Salesforce Apex REST: /services/apexrest/external-forms/submit
  return res.status(200).json({
    ok: true,
    message: "Received payload (Salesforce integration not wired yet).",
    token,
    receivedKeys: Object.keys(payload)
  });
});

app.listen(PORT, () => {
  console.log(`Navitas External Forms running on port ${PORT}`);
});

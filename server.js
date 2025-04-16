// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(bodyParser.json());

// Geçici olarak hafızada tutalım (production için veritabanı kullan)
let codes = {};

app.post("/send-code", async (req, res) => {
  const { email } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000); // 6 haneli
  codes[email] = { code, expires: Date.now() + 5 * 60 * 1000 }; // 5 dk geçerli

  try {
    await resend.emails.send({
      from: "Onay Kodu <onay@resend.dev>",
      to: email,
      subject: "E-mail Doğrulama Kodunuz",
      html: `<h2>Kodunuz: ${code}</h2><p>Bu kod 5 dakika geçerlidir.</p>`,
    });

    res.json({ success: true, message: "Kod gönderildi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "E-posta gönderilemedi." });
  }
});

app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  const entry = codes[email];

  if (!entry) {
    return res.status(400).json({ success: false, message: "Kod bulunamadı." });
  }

  if (Date.now() > entry.expires) {
    return res.status(400).json({ success: false, message: "Kodun süresi doldu." });
  }

  if (String(entry.code) !== String(code)) {
    return res.status(400).json({ success: false, message: "Kod yanlış." });
  }

  // Doğrulandı
  delete codes[email]; // Tek seferlik kod

  res.json({ success: true, message: "Kod doğrulandı." });
});

app.listen(3000, () => console.log("Server 3000 portunda çalışıyor"));

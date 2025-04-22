require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(bodyParser.json());

let codes = {};

app.post("/send-code", async (req, res) => {
  console.log("📤 GÖNDERİLEN kod:", code, "→", email);
  console.log("📋 Tüm kayıtlı kodlar:", codes);

  const email = req.body.email?.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000); // 6 haneli

  codes[email] = { code, expires: Date.now() + 5 * 60 * 1000 }; // 5 dk geçerli

  console.log("📤 GÖNDERİLEN kod:", code, "→", email);

  try {
    await resend.emails.send({
      from: "Onay Kodu <onay@resend.dev>",
      to: email,
      subject: "E-mail Doğrulama Kodunuz",
      html: `<h2>Kodunuz: ${code}</h2><p>Bu kod 5 dakika geçerlidir.</p>`,
    });

    res.json({ success: true, message: "Kod gönderildi." });
  } catch (err) {
    console.error("❌ E-posta gönderilemedi:", err);
    res.status(500).json({ success: false, message: "E-posta gönderilemedi." });
  }
});

app.post("/verify-code", (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  const code = req.body.code?.toString().trim();

  const entry = codes[email];
  console.log("📥 DOĞRULAMA gelen email:", email);
console.log("📥 DOĞRULAMA gelen kod:", code);
console.log("📋 Tüm kayıtlı kodlar:", codes);

  console.log("📥 DOĞRULAMA gelen email:", email);
  console.log("📥 DOĞRULAMA gelen kod:", code);
  console.log("🗃️  KAYITLI kod:", entry?.code);
  console.log("🕒 KOD GEÇERLİLİK:", entry?.expires, "Şu an:", Date.now());

  if (!entry) {
    return res.status(400).json({ success: false, message: "Kod bulunamadı." });
  }

  if (Date.now() > entry.expires) {
    console.log("⚠️ Kodun süresi dolmuş.");
    return res
      .status(400)
      .json({ success: false, message: "Kodun süresi doldu." });
  }

  if (entry.code.toString() !== code) {
    console.log("❌ Kod eşleşmiyor:", entry.code.toString(), code);
    return res.status(400).json({ success: false, message: "Kod yanlış." });
  }

  console.log("✅ Kod doğrulandı:", email);
  delete codes[email]; // Tek seferlik

  res.json({ success: true, message: "Kod doğrulandı." });
});

app.get("/", (req, res) => {
  res.send("E-posta doğrulama sunucusu çalışıyor.");
}
);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});

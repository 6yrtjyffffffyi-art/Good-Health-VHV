import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini AI Client on server
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Announcement Draft Endpoint
  app.post("/api/ai/draft-announcement", async (req, res) => {
    try {
      const { topic, timeOfDay, targetAudience, extraNotes } = req.body;

      const prompt = `คุณคือผู้ช่วย AI สำหรับ อสม. (อาสาสมัครสาธารณสุขประจำหมู่บ้าน) ในประเทศไทย
โปรดช่วยร่างข้อความประกาศข่าวสารสุขภาพชุมชนภาษาไทยสำหรับส่งให้ผู้ป่วย/ผู้สูงอายุและญาติในชุมชน
- หัวข้อประกาศ: ${topic || "แจ้งข่าวสารสุขภาพประจำชุมชน"}
- ช่วงเวลา/ฤดูกาล: ${timeOfDay || "ทั่วไป"}
- กลุ่มเป้าหมาย: ${targetAudience || "ผู้สูงอายุและผู้ดูแลในชุมชน"}
- ข้อมูลเพิ่มเติม: ${extraNotes || "ไม่มี"}

โปรดตอบในรูปแบบ JSON ดังนี้:
{
  "title": "หัวข้อประกาศภาษาไทยที่กระชับ สุภาพ เข้าใจง่าย",
  "content": "เนื้อหาประกาศเต็มภาษาไทย มีคำแนะนำปฏิบัติตน ดูแลสุขภาพ สุภาพ อบอุ่น ชัดเจน ใช้ภาษาอ่านง่ายสำหรับผู้สูงอายุ"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const jsonText = response.text || "{}";
      const data = JSON.parse(jsonText);
      res.json({ success: true, draft: data });
    } catch (error: any) {
      console.error("AI Draft Announcement Error:", error?.message || error);
      res.json({
        success: false,
        error: error?.message || "ไม่สามารถติดต่อระบบ AI ได้",
        draft: {
          title: req.body?.topic ? `[ร่าง] ${req.body.topic}` : "[ร่าง] ประกาศข่าวสารสุขภาพชุมชน",
          content: `เรียน พ่อแม่พี่น้องและผู้สูงอายุทุกท่าน\n\nขอแจ้งข่าวสารเรื่อง ${req.body?.topic || "การดูแลสุขภาพประจำชุมชน"}\nโปรดรับประทานยาตามมื้อ พักผ่อนให้เพียงพอ และสวมหน้ากากเมื่ออยู่ในที่แออัด หากมีอาการผิดปกติแจ้ง อสม. หรือญาติได้ทันทีครับ/ค่ะ`,
        },
      });
    }
  });

  // AI Drug Information Linker Endpoint
  app.post("/api/ai/drug-lookup", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || !query.trim()) {
        return res.status(400).json({ success: false, error: "กรุณาระบุชื่อยา" });
      }

      const prompt = `คุณคือเภสัชกรผู้เชี่ยวชาญด้านยาและข้อมูลเภสัชวิทยาในประเทศไทย
ผู้ใช้ต้องการสืบค้นและลิงก์ข้อมูลของยาชื่อ: "${query}"
โปรดวิเคราะห์ชื่อยานี้ (อาจเป็นชื่อการค้า ภาษาไทย ภาษาอังกฤษ หรือชื่อสามัญ) และสร้างข้อมูลที่ถูกต้อง ครบถ้วน เพื่อนำไปบันทึกในระบบจัดการยาของผู้ป่วย/ผู้สูงอายุ

โปรดตอบในรูปแบบ JSON เท่านั้น (Strict JSON):
{
  "tradeName": "ชื่อยาภาษาไทย/ชื่อการค้าที่นิยมเรียก เช่น ยาลดความดัน แอมโลดิพีน",
  "genericName": "ชื่อสามัญทางยาภาษาอังกฤษ เช่น Amlodipine Besylate",
  "category": "กลุ่มยา เช่น ยาลดความดันโลหิต, ยารักษาเบาหวาน, ยาแก้ปวดลดอักเสบ, ยาปฏิชีวนะฆ่าเชื้อ, ยาแก้แพ้, ยาลดกรดในกระเพาะ",
  "indication": "สรรพคุณหรือข้อบ่งใช้สั้นๆ เช่น ใช้รักษาความดันโลหิตสูงและป้องกันอาการแน่นหน้าอก",
  "dosage": "ขนาดมาตรฐานที่พบบ่อย เช่น 5 mg, 500 mg, 1 เม็ด",
  "frequency": "ความถี่ในการรับประทานที่พบบ่อย เช่น รับประทานวันละ 1 ครั้ง, รับประทานวันละ 2 ครั้ง",
  "mealTimings": ["เช้า", "หลังอาหาร"],
  "caution": "ข้อควรระวังสำคัญ เช่น รับประทานหลังอาหารทันที หรือระวังอาการเวียนศีรษะ",
  "notes": "คำแนะนำเพิ่มเติม เช่น ควรรับประทานสม่ำเสมอเวลาเดิมทุกวัน"
}

หมายเหตุ: ใน mealTimings ให้เลือกจากคำเหล่านี้ที่เกี่ยวข้อง: "เช้า", "เที่ยง", "เย็น", "ก่อนนอน", "ก่อนอาหาร", "หลังอาหาร", "พร้อมอาหาร", "เมื่อมีอาการ"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const jsonText = response.text || "{}";
      const data = JSON.parse(jsonText);
      res.json({ success: true, drug: data });
    } catch (error: any) {
      console.error("AI Drug Lookup Error:", error?.message || error);
      res.json({
        success: false,
        error: error?.message || "ไม่สามารถติดต่อระบบ AI ได้",
      });
    }
  });

  // Vite Middleware for Development vs Static Serve for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Health App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ success: false, message: "No URL provided." });
  }

  try {
    const response = await axios.get(videoUrl, {
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://www.youtube.com/",
        "Accept": "*/*",
        "Range": "bytes=0-"
      }
    });

    const contentType = response.headers["content-type"] || "application/octet-stream";
    const ext = contentType.includes("mp4") ? ".mp4" : "";
    const filename = `video-${Date.now()}${ext}`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", contentType);
    response.data.pipe(res);

  } catch (error) {
    console.error("🔥 Proxy download error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
    res.status(500).json({ success: false, message: "Failed to download video." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Proxy Downloader Running");
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
                                 

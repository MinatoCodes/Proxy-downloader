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
        "User-Agent": "Mozilla/5.0",
        "Referer": videoUrl
      }
    });

    const filename = "video-" + Date.now() + ".mp4";
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({ success: false, message: "Failed to download video." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Proxy Video Downloader is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
      

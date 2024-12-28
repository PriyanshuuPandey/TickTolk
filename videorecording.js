let mediaRecorder;
let recordedChunks = [];
const videoPreview = document.getElementById("videoPreview");
const startRecordingBtn = document.getElementById("startRecording");
const stopRecordingBtn = document.getElementById("stopRecording");
const uploadVideoBtn = document.getElementById("uploadVideo");
const applyFilterBtn = document.getElementById("applyFilter");
const uploadSongInput = document.getElementById("uploadSong");

// Access user's camera
async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoPreview.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);

      videoPreview.srcObject = null; // Stop camera feed
      videoPreview.src = videoUrl;
      videoPreview.controls = true;
      uploadVideoBtn.disabled = false;
      applyFilterBtn.disabled = false;
    };
  } catch (error) {
    alert("Error accessing camera: " + error.message);
  }
}

// Start recording
startRecordingBtn.addEventListener("click", () => {
  recordedChunks = [];
  mediaRecorder.start();
  startRecordingBtn.disabled = true;
  stopRecordingBtn.disabled = false;
});

// Stop recording
stopRecordingBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startRecordingBtn.disabled = false;
  stopRecordingBtn.disabled = true;
});

// Apply filters
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    videoPreview.style.filter = filter;
  });
});

// Add song
uploadSongInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    alert("Song added: " + file.name);
  }
});

// Upload video
uploadVideoBtn.addEventListener("click", () => {
  const videoBlob = new Blob(recordedChunks, { type: "video/webm" });

  // Simulate an upload process
  const formData = new FormData();
  formData.append("video", videoBlob, "video.webm");

  alert("Video uploaded successfully!");
});

// Initialize camera on page load
setupCamera();
// Video trimming logic using FFmpeg.js
const applyTrimBtn = document.getElementById("applyTrim");

applyTrimBtn.addEventListener("click", async () => {
  const trimStart = document.getElementById("trimStart").value;
  const trimEnd = document.getElementById("trimEnd").value;

  if (trimStart >= trimEnd) {
    alert("Invalid trim range");
    return;
  }

  const ffmpeg = await FFmpeg.createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "input.webm", await fetchFile(videoBlob));

  // Trim the video
  await ffmpeg.run(
    "-i",
    "input.webm",
    "-ss",
    `${trimStart}`,
    "-to",
    `${trimEnd}`,
    "-c",
    "copy",
    "output.webm"
  );

  const trimmedVideo = ffmpeg.FS("readFile", "output.webm");
  const trimmedBlob = new Blob([trimmedVideo.buffer], { type: "video/webm" });
  const trimmedUrl = URL.createObjectURL(trimmedBlob);

  videoPreview.src = trimmedUrl;
  alert("Video trimmed successfully!");
});
const mergeMusicBtn = document.getElementById("mergeMusic");

mergeMusicBtn.addEventListener("click", async () => {
  const musicFile = document.getElementById("musicFile").files[0];
  if (!musicFile) {
    alert("Please upload a music file!");
    return;
  }

  const musicBlob = await musicFile.arrayBuffer();
  const ffmpeg = await FFmpeg.createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "video.webm", await fetchFile(videoBlob));
  ffmpeg.FS("writeFile", "audio.mp3", new Uint8Array(musicBlob));

  // Merge music with video
  await ffmpeg.run(
    "-i",
    "video.webm",
    "-i",
    "audio.mp3",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "output.webm"
  );

  const mergedVideo = ffmpeg.FS("readFile", "output.webm");
  const mergedBlob = new Blob([mergedVideo.buffer], { type: "video/webm" });
  const mergedUrl = URL.createObjectURL(mergedBlob);

  videoPreview.src = mergedUrl;
  alert("Music merged successfully!");
});
const express = require("express");
const multer = require("multer");
const app = express();

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("video"), (req, res) => {
  res.send({ status: "success", filePath: req.file.path });
});

app.listen(3000, () => console.log("Server running on port 3000"));
uploadVideoBtn.addEventListener("click", async () => {
  const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
  const formData = new FormData();
  formData.append("video", videoBlob);

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status === "success") {
      alert("Video uploaded successfully!");
    }
  } catch (error) {
    alert("Error uploading video: " + error.message);
  }
});
videoPreview.addEventListener("play", () => {
  const audio = new Audio(URL.createObjectURL(musicBlob));
  audio.play();
  audio.loop = true;
});

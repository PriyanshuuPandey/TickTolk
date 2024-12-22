const videoElement = document.getElementById("video");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const uploadBtn = document.getElementById("upload-btn");

let mediaRecorder;
let recordedChunks = [];

// Access user's camera
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    videoElement.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
      const videoURL = URL.createObjectURL(videoBlob);
      localStorage.setItem("uploadedVideo", videoURL); // Simulate upload
      alert("Video uploaded successfully!");
      uploadBtn.disabled = false;
    };
  });

// Start Recording
startBtn.addEventListener('click', () => {
  recordedChunks = [];
  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

// Stop Recording
stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
// Fetch uploaded videos
async function fetchVideos() {
    const response = await fetch("/videos");
    const videos = await response.json();
    uploadedVideosContainer.innerHTML = "";
    videos.forEach((video) => {
      const videoElement = document.createElement("video");
      videoElement.src = video.url;
      videoElement.controls = true;
      videoElement.classList.add("uploaded-video");
      uploadedVideosContainer.appendChild(videoElement);
    });
  }
  
  fetchVideos();
  
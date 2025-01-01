let mediaRecorder;
let recordedChunks = [];
const videoPreview = document.getElementById('videoPreview');

// Start Recording
document.getElementById('startRecording').addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  videoPreview.srcObject = stream;

  mediaRecorder = new MediaRecorder(stream);
  recordedChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    videoPreview.srcObject = null;
    videoPreview.src = url;
    videoPreview.controls = true;
    document.getElementById('shareVideo').disabled = false;
  };

  mediaRecorder.start();
  toggleButtons(true);
});

// Stop Recording
document.getElementById('stopRecording').addEventListener('click', () => {
  mediaRecorder.stop();
  const tracks = videoPreview.srcObject.getTracks();
  tracks.forEach(track => track.stop());
  toggleButtons(false);
});

function toggleButtons(isRecording) {
  document.getElementById('startRecording').disabled = isRecording;
  document.getElementById('stopRecording').disabled = !isRecording;
}

// Apply Effects
document.getElementById('effectDropdown').addEventListener('change', (e) => {
  videoPreview.style.filter = e.target.value;
});

// Export Video
document.getElementById('exportVideo').addEventListener('click', () => {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'video.webm';
  link.click();
});

// Share Video
document.getElementById('shareVideo').addEventListener('click', () => {
  alert('Share functionality to be implemented.');
});

// Add Music
document.getElementById('musicFile').addEventListener('change', () => {
  alert('Music will be added.');
});

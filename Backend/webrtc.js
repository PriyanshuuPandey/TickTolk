
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    addVideoStream(myVideo, stream);

    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
    });

    socket.on("user-disconnected", (userId) => {
        if (peerConnections[userId]) {
            peerConnections[userId].close();
        }
    });
});

socket.emit("join-room", "room1", socket.id);

function connectToNewUser(userId, stream) {
    const peer = new RTCPeerConnection();
    peerConnections[userId] = peer;

    stream.getTracks().forEach(track => {
        peer.addTrack(track, stream);
    });

    peer.ontrack = (event) => {
        const video = document.createElement("video");
        addVideoStream(video, event.streams[0]);
    };

    peer.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("signal", { to: userId, signal: event.candidate });
        }
    };

    socket.on("signal", (data) => {
        peer.addIceCandidate(new RTCIceCandidate(data.signal));
    });
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.append(video);
}
const socket = io("http://localhost:5000");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
const peerConnections = {};

// Automatically start streaming when "Go Live" button is clicked
document.getElementById("goLiveButton").addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        addVideoStream(myVideo, stream);

        socket.emit("join-room", "room1", socket.id);

        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
        });

        socket.on("user-disconnected", (userId) => {
            if (peerConnections[userId]) peerConnections[userId].close();
        });
    });
});

function connectToNewUser(userId, stream) {
    const peer = new RTCPeerConnection();
    peerConnections[userId] = peer;

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.ontrack = (event) => {
        const video = document.createElement("video");
        addVideoStream(video, event.streams[0]);
    };

    peer.onicecandidate = (event) => {
        if (event.candidate) socket.emit("signal", { to: userId, signal: event.candidate });
    };

    socket.on("signal", (data) => peer.addIceCandidate(new RTCIceCandidate(data.signal)));
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => video.play());
    videoGrid.append(video);
}
socket.on("update-viewers", (count) => {
    document.getElementById("viewerCount").innerText = `Viewers: ${count}`;
});
const peer = new RTCPeerConnection({
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Google's STUN server
        { urls: "turn:your.turnserver.com", username: "user", credential: "pass" } // Add TURN for better connectivity
    ]
});

// Enable bitrate control for better performance
peer.createOffer().then(offer => {
    offer.sdp = offer.sdp.replace("b=AS:30", "b=AS:500"); // Increase video bitrate
    peer.setLocalDescription(offer);
});
// Send a message when the user sends it
document.getElementById("chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("chatInput").value;
    socket.emit("chat-message", message);
    document.getElementById("chatInput").value = ""; // Clear input
});

// Receive and display chat messages
socket.on("chat-message", (message) => {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
});
const firebaseConfig = {
    apiKey: "AIzaSyAIqWdQBiLgNcb1IrNavB9_Exrv3sxiSeQ",
    authDomain: "tolkindia.firebaseapp.com",
    projectId: "tolkindia",
    storageBucket: "tolkindia.firebasestorage.app",
    messagingSenderId: "82212526447",
    appId: "1:82212526447:web:5899fea9b6d6a0d853f09a",
    measurementId: "G-9XR93DWVXN"
  };
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

let mediaRecorder;
let recordedChunks = [];

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    const mediaStream = stream;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const storageRef = storage.ref();
        const videoRef = storageRef.child("recordings/stream_" + new Date().getTime() + ".webm");
        
        // Upload to Firebase Storage
        videoRef.put(blob).then((snapshot) => {
            console.log("Video uploaded to Firebase!");
        }).catch((error) => {
            console.error("Error uploading video: ", error);
        });
    };

    // Start recording when live stream starts
    mediaRecorder.start();
});

// Stop recording when the "Go Live" button is clicked again
document.getElementById("stopLiveButton").addEventListener("click", () => {
    mediaRecorder.stop();
});

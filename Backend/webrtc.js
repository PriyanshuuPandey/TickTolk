const socket = io("http://localhost:5000");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
const peerConnections = {};

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

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "ticktolk.appspot.com",
});

const bucket = admin.storage().bucket();

async function uploadVideo(filePath, destination) {
    await bucket.upload(filePath, {
        destination,
        metadata: { contentType: "video/mp4" },
    });
    console.log(`Uploaded: ${destination}`);
}

module.exports = { uploadVideo };

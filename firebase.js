import firebase from 'firebase/app';
import 'firebase/messaging';

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

const messaging = firebase.messaging();

// Request permission to show notifications
async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await messaging.getToken();
      console.log('Token: ', token);
      // Send token to your backend to store it
    }
  } catch (error) {
    console.error('Permission denied for notifications', error);
  }
}

// Handle incoming messages
messaging.onMessage((payload) => {
  console.log('Message received: ', payload);
  // Display a notification
});

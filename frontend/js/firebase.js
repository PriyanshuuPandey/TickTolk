import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
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

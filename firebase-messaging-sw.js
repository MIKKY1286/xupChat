// Import Firebase SDKs for compatibility with service workers
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// Initialize Firebase with your config
firebase.initializeApp({
  apiKey: "AIzaSyCsa2c82g1OHNU2HcxCyQLr5RSM7DEDQXM",
  authDomain: "deepvoid-6baf3.firebaseapp.com",
  projectId: "deepvoid-6baf3",
  storageBucket: "deepvoid-6baf3.appspot.com",
  messagingSenderId: "648550508783",
  appId: "1:648550508783:web:6220982bf050d8e74b531a"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || './images/youchat-logo.png', // Make sure this exists
    click_action: payload.notification.click_action || 'https://xup-chat.vercel.app' // Optional deep link
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js ");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js ");

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
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const { title, body, icon } = payload.notification || {};

  // Show a notification to the user
  self.registration.showNotification(title, {
    body,
    icon: icon || './images/youchat-logo.png', // fallback icon
    data: {
      click_action: payload.data?.click_action || './pages/chat.html',
      roomId: payload.data?.roomId,
      senderId: payload.data?.senderId
    }
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification

  const urlToOpen = new URL(event.notification.data.click_action || './pages/chat.html', location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
// firebase-messaging-sw.js

// Import Firebase compat libraries
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

// Your Firebase config (same as in your main app)
const firebaseConfig = {
    apiKey: "AIzaSyCsa2c82g1OHNU2HcxCyQLr5RSM7DEDQXM",
    authDomain: "deepvoid-6baf3.firebaseapp.com",
    projectId: "deepvoid-6baf3",
    storageBucket: "deepvoid-6baf3.appspot.com",
    messagingSenderId: "648550508783",
    appId: "1:648550508783:web:6220982bf050d8e74b531a"
};

// Initialize Firebase app (compat mode)
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging (compat)
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification?.title || 'No title';
    const notificationOptions = {
        body: payload.notification?.body || 'No body',
        icon: payload.notification?.icon || '/icon.png',
        data: {
            url: payload.data?.url || '/'  // Optional: custom click action URL
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification

    // Get the URL from notification data or fallback
    const redirectUrl = event.notification.data?.url || 'xup-chat.vercel.app';

    // Open a window or focus an existing one
    event.waitUntil(
        clients.openWindow(redirectUrl)
    );
});
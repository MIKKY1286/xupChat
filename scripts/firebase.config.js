// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsa2c82g1OHNU2HcxCyQLr5RSM7DEDQXM",
    authDomain: "deepvoid-6baf3.firebaseapp.com",
    projectId: "deepvoid-6baf3",
    storageBucket: "deepvoid-6baf3.appspot.com",
    messagingSenderId: "648550508783",
    appId: "1:648550508783:web:6220982bf050d8e74b531a"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  const messaging = firebase.messaging();
  
  // Request Notification Permission and Get Token
  function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        messaging.getToken({ vapidKey: 'YOUR_VAPID_PUBLIC_KEY' }).then(token => {
          console.log('Firebase Messaging Token:', token);
          // Send this token to your server to associate it with the user
        }).catch(error => {
          console.error('Error retrieving Firebase Messaging Token:', error);
        });
      } else {
        console.warn('Notification permission denied.');
      }
    });
  }
  
  // Handle background messages
  messaging.onBackgroundMessage(payload => {
    console.log('Background message received:', payload);
    const { title, body, icon } = payload.notification;
    new Notification(title, { body, icon });
  });


  export function saveUserToken(user) {
    if (!user) return;
  
    messaging.getToken({ vapidKey: 'YOUR_VAPID_PUBLIC_KEY' }).then(token => {
      db.collection('userTokens').doc(user.uid).set({
        token: token,
        userId: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log('Token saved successfully:', token);
      }).catch(error => {
        console.error('Error saving token:', error);
      });
    }).catch(error => {
      console.error('Error retrieving Firebase Messaging Token:', error);
    });
  }
  
  export { app, db, auth, messaging, requestNotificationPermission };
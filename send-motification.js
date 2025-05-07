const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./path-to-your-service-account.json'); // From Firebase Project Settings → Service Accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com"
});

// Endpoint to send notification
app.post('/send', async (req, res) => {
  const { userId, title, body } = req.body;

  try {
    // Fetch user's FCM token from Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      return res.status(400).json({ error: "User does not have an FCM token." });
    }

    // Prepare message
    const message = {
      notification: { title, body },
      token: fcmToken,
      data: {
        click_action: "https://your-site.com",
        screen: "/notifications" // Optional deep link or route
      }
    };

    // Send message
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
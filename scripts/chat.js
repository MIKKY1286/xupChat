// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    getFirestore, collection, doc, getDoc, addDoc, onSnapshot, orderBy, query 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsa2c82g1OHNU2HcxCyQLr5RSM7DEDQXM",
    authDomain: "deepvoid-6baf3.firebaseapp.com",
    projectId: "deepvoid-6baf3",
    storageBucket: "deepvoid-6baf3.firebasestorage.app",
    messagingSenderId: "648550508783",
    appId: "1:648550508783:web:1fa9900478503abe4b531a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements.
const chatHeader = document.getElementById("chat-header");
const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendMessageBtn = document.getElementById("send-message");

// Get URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get("chatId");
const receiverId = urlParams.get("receiverId");

// Check user authentication
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You must be logged in to chat.",
            confirmButtonColor: "#6a0dad"
        }).then(() => {
            window.location.href = "login.html";
        });
        return;
    }

    loadChat(user.uid);
});

// Load Chat Messages
async function loadChat(userId) {
    chatMessages.innerHTML = `<p>Loading messages...</p>`;

    try {
        // Fetch receiver's username
        const receiverRef = doc(db, "users", receiverId);
        const receiverSnap = await getDoc(receiverRef);

        if (receiverSnap.exists()) {
            chatHeader.innerText = receiverSnap.data().username || "Unknown User";
        } else {
            chatHeader.innerText = "Unknown User";
        }

        // Load messages in real-time
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        onSnapshot(q, (snapshot) => {
            chatMessages.innerHTML = "";

            snapshot.forEach((doc) => {
                const messageData = doc.data();
                const isMine = messageData.senderId === userId;

                const messageDiv = document.createElement("div");
                messageDiv.classList.add(isMine ? "my-message" : "their-message");
                messageDiv.innerHTML = `<p>${messageData.text}</p>`;

                chatMessages.appendChild(messageDiv);
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    } catch (error) {
        console.error("Error loading chat:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to Load Chat",
            text: "An error occurred while loading the chat.",
            confirmButtonColor: "#6a0dad"
        });
    }
}

// Send Message
sendMessageBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const messageText = messageInput.value.trim();
    if (!messageText) {
        Swal.fire({
            icon: "warning",
            title: "Invalid Input",
            text: "Message cannot be empty!",
            confirmButtonColor: "#6a0dad"
        });
        return;
    }

    try {
        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
            text: messageText,
            senderId: user.uid,
            timestamp: new Date()
        });

        messageInput.value = "";
    } catch (error) {
        console.error("Error sending message:", error);
        Swal.fire({
            icon: "error",
            title: "Send Failed",
            text: "An error occurred while sending your message.",
            confirmButtonColor: "#6a0dad"
        });
    }
});

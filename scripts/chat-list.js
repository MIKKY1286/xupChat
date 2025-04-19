import { auth, db } from "./firebase-config.js";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const chatList = document.getElementById("chatList");
const searchInput = document.getElementById("searchChats");
const newChatBtn = document.getElementById("newChatBtn");
let userId = null;

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        loadChats();
    } else {
        window.location.href = "login.html";
    }
});

// Function to load chat list
function loadChats() {
    if (!userId) return;

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where(`participants.${userId}`, "!=", null), orderBy("lastMessage.timestamp", "desc"));

    onSnapshot(q, async (querySnapshot) => {
        chatList.innerHTML = "";

        if (querySnapshot.empty) {
            chatList.innerHTML = `<p>No chats found.</p>`;
            return;
        }

        querySnapshot.forEach(async (docSnapshot) => {
            const chatData = docSnapshot.data();
            const chatId = docSnapshot.id;
            const otherUserId = Object.keys(chatData.participants).find(id => id !== userId);

            const otherUserSnap = await getDoc(doc(db, "users", otherUserId));
            const otherUser = otherUserSnap.exists() ? otherUserSnap.data() : { name: "Unknown", profilePic: "" };

            const lastMsg = chatData.lastMessage?.text || "No messages yet";
            const unread = chatData.lastMessage?.readBy.includes(userId) ? "" : `<span class="unread-badge">1</span>`;

            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.innerHTML = `
                <img src="${otherUser.profilePic || 'default.png'}">
                <div class="chat-info">
                    <h4>${otherUser.name}</h4>
                    <p>${lastMsg}</p>
                </div>
                ${unread}
            `;

            chatItem.addEventListener("click", () => {
                window.location.href = `chat.html?chatId=${chatId}`;
            });

            chatList.appendChild(chatItem);
        });
    });
}

// Start a new chat
newChatBtn.addEventListener("click", () => {
    window.location.href = "new-chat.html";
});

// Search Chats
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll(".chat-item").forEach(chat => {
        const name = chat.querySelector("h4").textContent.toLowerCase();
        chat.style.display = name.includes(searchTerm) ? "flex" : "none";
    });
});

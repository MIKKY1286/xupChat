import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsa2c82g1OHNU2HcxCyQLr5RSM7DEDQXM",
    authDomain: "deepvoid-6baf3.firebaseapp.com",
    projectId: "deepvoid-6baf3",
    storageBucket: "deepvoid-6baf3.firebasestorage.app",
    messagingSenderId: "648550508783",
    appId: "1:648550508783:web:1fa9900478503abe4b531a"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 Get Input Field & Results List
const searchInput = document.getElementById("searchUser");
const resultsContainer = document.getElementById("searchResults");

// 🔹 Fetch Users by Email Across All Folders
const searchUserByEmail = async (email) => {
    resultsContainer.innerHTML = "Fetching..."; // Show loading state

    const usersRef = collection(db, "users"); // Change "users" if necessary
    const q = query(usersRef, where("email", "==", email));
    
    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            resultsContainer.innerHTML = `<p>No user found with email: ${email}</p>`;
            return;
        }

        resultsContainer.innerHTML = ""; // Clear previous results
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userHTML = `
                <div class="user-card">
                    <p><strong>Name:</strong> ${userData.name || "Unknown"}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                    <button onclick="startChat('${doc.id}')">Chat</button>
                </div>
            `;
            resultsContainer.innerHTML += userHTML;
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        resultsContainer.innerHTML = `<p>Error fetching users.</p>`;
    }
};

// 🔹 Handle Input Change (Fetch while typing)
searchInput.addEventListener("input", (e) => {
    const email = e.target.value.trim();
    if (email.length > 3) {
        searchUserByEmail(email);
    } else {
        resultsContainer.innerHTML = "";
    }
});

// 🔹 Start Chat Function (Redirect or Open Chat)
const startChat = (userId) => {
    alert(`Start chat with user: ${userId}`);
    // Redirect or open chat page with userId
};


localStorage.clear();
sessionStorage.clear();

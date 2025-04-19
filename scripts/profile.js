// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, onAuthStateChanged, updateProfile, signOut 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// DOM Elements
const profilePic = document.getElementById("profile-pic");
const usernameInput = document.getElementById("username");
const saveProfileBtn = document.getElementById("save-profile");
const logoutBtn = document.getElementById("logout-btn");

// Check user authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        usernameInput.value = user.displayName || "";

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            profilePic.src = userSnap.data().profilePic || "default.jpg";
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You must be logged in to view your profile.",
            confirmButtonColor: "#6a0dad"
        }).then(() => {
            window.location.href = "login.html";
        });
    }
});

// Save Profile Updates
saveProfileBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newUsername = usernameInput.value.trim();
    if (!newUsername) {
        Swal.fire({
            icon: "warning",
            title: "Invalid Input",
            text: "Username cannot be empty!",
            confirmButtonColor: "#6a0dad"
        });
        return;
    }

    try {
        await updateProfile(user, { displayName: newUsername });

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { username: newUsername });

        Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been updated successfully!",
            confirmButtonColor: "#6a0dad"
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "An error occurred while updating your profile.",
            confirmButtonColor: "#6a0dad"
        });
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        Swal.fire({
            icon: "success",
            title: "Logged Out",
            text: "You have been successfully logged out!",
            confirmButtonColor: "#6a0dad"
        }).then(() => {
            window.location.href = "login.html";
        });
    } catch (error) {
        console.error("Logout Error:", error);
        Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: "An error occurred while logging out.",
            confirmButtonColor: "#6a0dad"
        });
    }
});

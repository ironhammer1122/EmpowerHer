// --- Firebase imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyAoUxwdktbXqBypvfePiwHBGTaWrrIAnEA",
  authDomain: "my-auth-prj-2559e.firebaseapp.com",
  projectId: "my-auth-prj-2559e",
  storageBucket: "my-auth-prj-2559e.firebasestorage.app",
  messagingSenderId: "888947531022",
  appId: "1:888947531022:web:0e503df83966e132b8cb5f",
  measurementId: "G-Q28J94NMYR"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);

// --- Email/Password Login ---
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Save user info locally
    localStorage.setItem("currentUser", user.email);
    localStorage.setItem("userType", "user");

    alert(`✅ Welcome back, ${user.email}!`);
    window.location.href = "user_dashboard.html"; // Redirect to user dashboard
  } catch (error) {
    console.error(error);
    alert("❌ Login failed: " + error.message);
  }
});

// --- Google Login ---
const googleBtn = document.getElementById("googleBtn");
googleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ Save user info locally
    localStorage.setItem("currentUser", user.email);
    localStorage.setItem("userType", "user");

    alert(`✅ Welcome ${user.displayName || user.email}!`);
    window.location.href = "index.html"; // Redirect to user dashboard
  } catch (error) {
    console.error(error);
    alert("❌ Error: " + error.message);
  }
});

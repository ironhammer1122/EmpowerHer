// --- Firebase imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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
const sellerLoginForm = document.getElementById("sellerLoginForm");
sellerLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("sellerEmail").value.trim();
  const password = document.getElementById("sellerPassword").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Store seller info in localStorage
    localStorage.setItem("currentUser", user.email);
    localStorage.setItem("userType", "seller");

    alert(`✅ Welcome back, ${user.email}!`);
    window.location.href = "index.html"; // redirect after login
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

    // ✅ Store seller info in localStorage
    localStorage.setItem("currentUser", user.email);
    localStorage.setItem("userType", "seller");

    alert(`✅ Welcome ${user.displayName || user.email}!`);
    window.location.href = "index.html"; // redirect after login
  } catch (error) {
    console.error(error);
    alert("❌ Error: " + error.message);
  }
});

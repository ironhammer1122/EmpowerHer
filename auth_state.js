// --- Firebase imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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
const auth = getAuth(app);

// --- Track user login state ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ User is logged in
    localStorage.setItem("currentUser", user.email);
  } else {
    // ❌ User is logged out
    localStorage.removeItem("currentUser");
  }
});

// --- Global logout function ---
window.logout = function() {
  signOut(auth).then(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cart");
    window.location.href = "login.html";
  }).catch((error) => {
    alert("Error logging out: " + error.message);
  });
};

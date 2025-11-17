// ====================
// Firebase SDK Imports
// ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ====================
// Firebase Configuration
// ====================
const firebaseConfig = {
  apiKey: "AIzaSyAoUxwdktbXqBypvfePiwHBGTaWrrIAnEA",
  authDomain: "my-auth-prj-2559e.firebaseapp.com",
  projectId: "my-auth-prj-2559e",
  storageBucket: "my-auth-prj-2559e.firebasestorage.app",
  messagingSenderId: "888947531022",
  appId: "1:888947531022:web:0e503df83966e132b8cb5f",
  measurementId: "G-Q28J94NMYR"
};

// ====================
// Initialize Firebase
// ====================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ====================
// DOM Ready Wrapper
// ====================
document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logout-btn");
  const nameEl = document.getElementById("user-name");

  // ====================
  // Check if user is logged in
  // ====================
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User logged in:", user.email);

      // Get extra user info from Firestore (optional)
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        let userName = "User";
        if (docSnap.exists()) {
          userName = docSnap.data().name || "User";
        } else {
          userName = user.displayName || "User";
        }

        if (nameEl) nameEl.textContent = userName;

      } catch (err) {
        console.error("Error fetching user data:", err);
        if (nameEl) nameEl.textContent = user.displayName || "User";
      }

    } else {
      // No user logged in → redirect to login page
      window.location.href = "user_login.html";
    }
  });

  // ====================
  // Logout Functionality
  // ====================
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          window.location.href = "user_login.html";
        })
        .catch(err => console.error("Logout error:", err));
    });
  }

  // ====================
  // Dashboard Button Navigation
  // ====================
  document.querySelectorAll(".dashboard-card .btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const action = e.target.textContent.trim();

      const routes = {
        "View Orders": "user_orders.html",
        "View Wishlist": "user_wishlist.html",
        "Edit Profile": "user_profile.html",
        "Manage Payments": "user_payments.html"
      };

      if (routes[action]) {
        window.location.href = routes[action];
      } else {
        console.warn("Unknown dashboard button action:", action);
      }
    });
  });

});

// ====================
// Firebase SDK Imports
// ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
// Wait for DOM to Load
// ====================
document.addEventListener("DOMContentLoaded", () => {
  const accountCart = document.querySelector(".account-cart");
  const accountIcon = document.getElementById("account-icon");
  const accountMenu = document.getElementById("account-menu");
  const accountName = document.getElementById("account-name");

  // Helper to clear account/cart HTML safely
  function resetAccountCart() {
    if (accountCart) accountCart.innerHTML = "";
  }

  // ====================
  // Auth State Check
  // ====================
  onAuthStateChanged(auth, async (user) => {
    resetAccountCart();

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const sellerRef = doc(db, "sellers", user.uid);
        const [userSnap, sellerSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(sellerRef)
        ]);

        let role = "user";
        let displayName = "User";

        if (sellerSnap.exists()) {
          role = "seller";
          displayName = sellerSnap.data().name || "Seller";
        } else if (userSnap.exists()) {
          role = "user";
          displayName = userSnap.data().name || "User";
        } else {
          displayName = user.displayName || "User";
        }

        if (accountName) accountName.textContent = `Hello, ${displayName}`;

        // ✅ Navbar when logged in
        accountCart.innerHTML = `
          <a href="${role === "seller" ? "seller_dashboard.html" : "user_dashboard.html"}">
            <i class="fa-solid fa-circle-user"></i> ${displayName}
          </a>
          <a href="cart.html"><i class="fa-solid fa-cart-shopping"></i> Cart</a>
          <a href="#" id="logoutLink"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
        `;

        // ✅ Logout handler
        const logoutLink = document.getElementById("logoutLink");
        if (logoutLink) {
          logoutLink.addEventListener("click", async (e) => {
            e.preventDefault();
            await signOut(auth);
            alert("👋 Logged out successfully!");
            window.location.reload();
          });
        }

      } catch (err) {
        console.error("Error loading user data:", err);
      }
    } else {
      // ✅ Not logged in → show login links + cart
      accountCart.innerHTML = `
        <a href="user_login.html"><i class="fa-solid fa-user"></i> User Login</a>
        <a href="seller_login.html"><i class="fa-solid fa-hand-holding-heart"></i> Seller Login</a>
        <a href="cart.html"><i class="fa-solid fa-cart-shopping"></i> Cart</a>
      `;
      if (accountName) accountName.textContent = "Hello, Guest";
    }
  });

  // ====================
  // Account Menu Toggle
  // ====================
  if (accountIcon && accountMenu) {
    accountIcon.addEventListener("click", () => {
      accountMenu.classList.toggle("hidden");
    });
  }
});

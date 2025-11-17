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
// DOM Elements
// ====================
const logoutBtn = document.getElementById("logout-btn");
const sellerNameEl = document.getElementById("seller-name");

// ====================
// Check if seller is logged in & display name
// ====================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "seller_login.html";
    return;
  }

  try {
    const docRef = doc(db, "sellers", user.uid);
    const docSnap = await getDoc(docRef);

    let sellerName = "Seller";
    if (docSnap.exists()) {
      sellerName = docSnap.data().name || "Seller"; // Only use the name they signed up with
    } else {
      sellerName = user.displayName || "Seller";
    }

    if (sellerNameEl) sellerNameEl.textContent = sellerName;

  } catch (err) {
    console.error("Error fetching seller data:", err);
    if (sellerNameEl) sellerNameEl.textContent = user.displayName || "Seller";
  }
});

// ====================
// Logout Functionality
// ====================
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => window.location.href = "seller_login.html")
      .catch(err => console.error("Logout error:", err));
  });
}

// ====================
// Dashboard Button Navigation
// ====================
document.querySelectorAll(".dashboard-card .btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const action = e.target.textContent.trim();

    const routes = {
      "Manage Products": "seller_manage_products.html",
      "Add Product": "seller_add_product.html",
      "View Orders": "seller_orders.html",
      "Edit Account": "seller_profile.html"
    };

    if (routes[action]) {
      window.location.href = routes[action];
    } else {
      console.warn("Unknown button action:", action);
    }
  });
});

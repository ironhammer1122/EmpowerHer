// ====================
// Firebase SDK Imports
// ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const form = document.getElementById("profile-form");
const statusMsg = document.getElementById("status-msg");

const storeNameInput = document.getElementById("storeName");
const ownerNameInput = document.getElementById("ownerName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const upiInput = document.getElementById("upi");
const addressInput = document.getElementById("address");

// ====================
// Auth & Load Seller Data
// ====================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailInput.value = user.email;

  try {
    const docRef = doc(db, "sellers", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      storeNameInput.value = data.storeName || "";
      ownerNameInput.value = data.ownerName || "";
      phoneInput.value = data.phone || "";
      upiInput.value = data.upi || "";
      addressInput.value = data.address || "";
    }
  } catch (err) {
    console.error("Error fetching seller data:", err);
    statusMsg.textContent = "Error loading profile!";
    statusMsg.style.color = "red";
  }
});

// ====================
// Logout
// ====================
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "login.html";
    }).catch(err => console.error("Logout error:", err));
  });
}

// ====================
// Update Profile
// ====================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "";

  const user = auth.currentUser;
  if (!user) return;

  const sellerData = {
    storeName: storeNameInput.value.trim(),
    ownerName: ownerNameInput.value.trim(),
    phone: phoneInput.value.trim(),
    upi: upiInput.value.trim(),
    address: addressInput.value.trim(),
    email: user.email
  };

  try {
    await setDoc(doc(db, "sellers", user.uid), sellerData, { merge: true });
    statusMsg.textContent = "Profile successfully updated ✅";
    statusMsg.style.color = "green";
  } catch (err) {
    console.error("Error updating profile:", err);
    statusMsg.textContent = "Failed to update profile ❌";
    statusMsg.style.color = "red";
  }
});

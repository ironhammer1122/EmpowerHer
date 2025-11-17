import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAoUxwdktbXqBypvfePiwHBGTaWrrIAnEA",
  authDomain: "my-auth-prj-2559e.firebaseapp.com",
  projectId: "my-auth-prj-2559e",
  storageBucket: "my-auth-prj-2559e.firebasestorage.app",
  messagingSenderId: "888947531022",
  appId: "1:888947531022:web:0e503df83966e132b8cb5f",
  measurementId: "G-Q28J94NMYR"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Elements
const form = document.getElementById("add-product-form");
const statusMsg = document.getElementById("status-msg");
const logoutBtn = document.getElementById("logout-btn");

let sellerId = null;

// 🔹 Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "seller_login.html";
    return;
  }
  sellerId = user.uid;
});

// 🔹 Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "seller_login.html";
});

// 🔹 Add product
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const image = document.getElementById("product-image").value.trim();
  const category = document.getElementById("product-category")?.value || "General";
  const description = document.getElementById("product-description")?.value || "";

  if (!name || !price) {
    statusMsg.textContent = "Please fill in all fields!";
    statusMsg.style.color = "red";
    return;
  }

  try {
    // 🔹 Prepare product data
    const productData = {
      sellerId,
      name,
      price,
      image,
      category,
      description,
      createdAt: serverTimestamp()
    };

    // ✅ 1. Add product under seller’s products subcollection
    await addDoc(collection(db, "sellers", sellerId, "products"), productData);

    // ✅ 2. Add same product to main "products" collection
    await addDoc(collection(db, "products"), productData);

    // ✅ Success
    statusMsg.textContent = "✅ Product added successfully!";
    statusMsg.style.color = "green";
    form.reset();
  } catch (error) {
    console.error(error);
    statusMsg.textContent = "❌ Error adding product: " + error.message;
    statusMsg.style.color = "red";
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAoUxwdktbXqBypvfePiwHBGTaWrrIAnEA",
  authDomain: "my-auth-prj-2559e.firebaseapp.com",
  projectId: "my-auth-prj-2559e",
  storageBucket: "my-auth-prj-2559e.firebasestorage.app",
  messagingSenderId: "888947531022",
  appId: "1:888947531022:web:0e503df83966e132b8cb5f",
  measurementId: "G-Q28J94NMYR"
};

// 🔹 Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const productsList = document.getElementById("products-list");
const logoutBtn = document.getElementById("logout-btn");

// 🔹 Realtime Product Loading
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "seller_login.html";
    return;
  }

  const productsRef = collection(db, "sellers", user.uid, "products");
  const productsQuery = query(productsRef, orderBy("createdAt", "desc"));

  onSnapshot(productsQuery, (snapshot) => {
    productsList.innerHTML = "";
    if (snapshot.empty) {
      productsList.innerHTML = "<p>No products added yet 🌸</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const productId = docSnap.id;

      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p>${product.description || ""}</p>
          <button class="delete-btn" data-id="${productId}">🗑 Delete</button>
        </div>
      `;

      productsList.appendChild(card);
    });

    // Attach delete event after rendering all
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.dataset.id;
        if (confirm("Are you sure you want to delete this product?")) {
          try {
            const productRef = doc(db, "sellers", user.uid, "products", productId);
            await deleteDoc(productRef);
            alert("Product deleted successfully ✅");
          } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product ❌");
          }
        }
      });
    });
  });
});

// 🔹 Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

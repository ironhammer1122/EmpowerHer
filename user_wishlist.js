// ===== Firebase Imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyAoUxwdktbXqBypvfePiwHBGTaWrrIAnEA",
  authDomain: "my-auth-prj-2559e.firebaseapp.com",
  projectId: "my-auth-prj-2559e",
  storageBucket: "my-auth-prj-2559e.firebasestorage.app",
  messagingSenderId: "888947531022",
  appId: "1:888947531022:web:0e503df83966e132b8cb5f",
  measurementId: "G-Q28J94NMYR"
};

// ===== Initialize Firebase =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const wishlistList = document.getElementById("wishlist-list");
  const logoutBtn = document.getElementById("logout-btn");

  // ===== Auth Check =====
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "user_login.html";
      return;
    }

    try {
      const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      wishlistList.innerHTML = "";

      if (querySnapshot.empty) {
        wishlistList.innerHTML = `<p class="loading">Your wishlist is empty 🌸</p>`;
        return;
      }

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const card = document.createElement("div");
        card.classList.add("wishlist-card");
        card.innerHTML = `
          <img src="${data.imageURL}" alt="${data.name}">
          <h3>${data.name}</h3>
          <p class="price">₹${data.price}</p>
          <button class="remove-btn">Remove</button>
        `;
        wishlistList.appendChild(card);

        // Remove functionality
        card.querySelector(".remove-btn").addEventListener("click", async () => {
          await deleteDoc(doc(db, "wishlist", docSnap.id));
          card.remove();
        });
      });
    } catch (err) {
      wishlistList.innerHTML = `<p class="loading" style="color:red;">Error loading wishlist: ${err.message}</p>`;
    }
  });

  // ===== Logout =====
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "user_login.html";
      });
    });
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoUxwdktbXqBypvfePiwHBGTaWrrIAnEA",
  authDomain: "my-auth-prj-2559e.firebaseapp.com",
  projectId: "my-auth-prj-2559e",
  storageBucket: "my-auth-prj-2559e.firebasestorage.app",
  messagingSenderId: "888947531022",
  appId: "1:888947531022:web:0e503df83966e132b8cb5f",
  measurementId: "G-Q28J94NMYR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ordersList = document.getElementById("orders-list");
const logoutBtn = document.getElementById("logout-btn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "seller_login.html";
    return;
  }

  try {
    const q = query(collection(db, "orders"), where("sellerId", "==", user.uid));
    const snapshot = await getDocs(q);

    ordersList.innerHTML = "";
    if (snapshot.empty) {
      ordersList.innerHTML = "<p>No orders yet 🌸</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const card = document.createElement("div");
      card.classList.add("order-card");
      card.innerHTML = `
        <div class="order-header">
          <span>Order ID: ${docSnap.id}</span>
          <span>${data.status}</span>
        </div>
        <p><strong>Items:</strong> ${data.items.join(", ")}</p>
        <p><strong>Total:</strong> ₹${data.total}</p>
        <p><strong>Date:</strong> ${new Date(data.date.seconds*1000).toLocaleDateString()}</p>
      `;
      ordersList.appendChild(card);
    });
  } catch (err) {
    ordersList.innerHTML = `<p style="color:red;">Error loading orders: ${err.message}</p>`;
  }
});

logoutBtn.addEventListener("click", () => signOut(auth).then(() => window.location.href = "seller_login.html"));

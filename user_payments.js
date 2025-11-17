import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAoUxwdktbXqBypvfePiwHBGTaWrrIAnEA",
  authDomain: "my-auth-prj-2559e.firebaseapp.com",
  projectId: "my-auth-prj-2559e",
  storageBucket: "my-auth-prj-2559e.firebasestorage.app",
  messagingSenderId: "888947531022",
  appId: "1:888947531022:web:0e503df83966e132b8cb5f",
  measurementId: "G-Q28J94NMYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logoutBtn = document.getElementById("logout-btn");
const savedPayments = document.getElementById("saved-payments");
const payBtn = document.getElementById("pay-btn");
const amountInput = document.getElementById("amount");
const statusMsg = document.getElementById("status-msg");

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "user_login.html");
  });
}

// Check auth and load saved payments
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "user_login.html";
    return;
  }

  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    savedPayments.innerHTML = "";
    if (docSnap.exists() && docSnap.data().payments) {
      const payments = docSnap.data().payments;
      payments.forEach(p => {
        const card = document.createElement("div");
        card.className = "payment-card";
        card.textContent = `${p.method} - ${p.details}`;
        savedPayments.appendChild(card);
      });
    } else {
      savedPayments.innerHTML = `<p>No saved payment methods 🌸</p>`;
    }
  } catch (err) {
    console.error("Error fetching payment methods:", err);
    savedPayments.innerHTML = `<p style="color:red;">Failed to load saved payments.</p>`;
  }
});

// Razorpay Test Payment
payBtn.addEventListener("click", () => {
  const amount = parseInt(amountInput.value);
  if (!amount || amount <= 0) {
    statusMsg.textContent = "Enter a valid amount";
    statusMsg.style.color = "red";
    return;
  }

  const options = {
    key: "rzp_test_RPknU2R394sRdz", // Replace with your Razorpay test key
    amount: amount * 100, // in paise
    currency: "INR",
    name: "EmpowerHer Test Payment",
    description: "Test transaction",
    handler: function(response){
      statusMsg.textContent = `Payment successful! Payment ID: ${response.razorpay_payment_id}`;
      statusMsg.style.color = "green";
    },
    theme: {
      color: "#D2694C"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});

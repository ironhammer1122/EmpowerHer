import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const profileForm = document.getElementById("profile-form");
const statusMsg = document.getElementById("status-msg");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

// Check user login
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "user_login.html";
    return;
  }

  emailInput.value = user.email || "";

  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      nameInput.value = data.name || "";
      phoneInput.value = data.phone || "";
      addressInput.value = data.address || "";
    } else {
      nameInput.value = user.displayName || "";
    }
  } catch (err) {
    console.error("Error fetching profile data:", err);
  }
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "user_login.html");
  });
}

// Update profile
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  const updatedData = {
    name: nameInput.value,
    phone: phoneInput.value,
    address: addressInput.value
  };

  // Check if anything changed
  if (
    updatedData.name === nameInput.defaultValue &&
    updatedData.phone === phoneInput.defaultValue &&
    updatedData.address === addressInput.defaultValue
  ) {
    statusMsg.textContent = "No changes detected 🌸";
    statusMsg.style.color = "orange";
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
    await updateProfile(user, { displayName: nameInput.value });

    // Update defaultValue to reflect latest saved data
    nameInput.defaultValue = updatedData.name;
    phoneInput.defaultValue = updatedData.phone;
    addressInput.defaultValue = updatedData.address;

    statusMsg.textContent = "Profile updated successfully 🌸";
    statusMsg.style.color = "green";
  } catch (err) {
    console.error("Error updating profile:", err);
    statusMsg.textContent = "Error updating profile. Try again!";
    statusMsg.style.color = "red";
  }
});


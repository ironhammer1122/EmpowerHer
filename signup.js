// signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ----------------- Firebase config -----------------
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
getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ----------------- Role toggle -----------------
const userBtn = document.getElementById("userBtn");
const sellerBtn = document.getElementById("sellerBtn");
const userForm = document.getElementById("userForm");
const sellerForm = document.getElementById("sellerForm");

userBtn.addEventListener("click", () => {
  userForm.classList.remove("hidden");
  sellerForm.classList.add("hidden");
  userBtn.classList.add("active");
  sellerBtn.classList.remove("active");
});

sellerBtn.addEventListener("click", () => {
  sellerForm.classList.remove("hidden");
  userForm.classList.add("hidden");
  sellerBtn.classList.add("active");
  userBtn.classList.remove("active");
});

// ----------------- Validation helper -----------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ----------------- Signup helper -----------------
async function registerUser({ name, email, password, role, skill = null }) {
  try {
    // Create user with email & password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Prepare user data
    const userData = {
      name,
      email,
      role,
      signupDate: new Date().toISOString()
    };
    if (skill) userData.skill = skill;

    // Save to correct collection
    const collectionName = role === "seller" ? "sellers" : "users";
    await setDoc(doc(db, collectionName, user.uid), userData);

    // Success popup & redirect
    alert(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
    window.location.href = role === "user" ? "user_login.html" : "seller_login.html";

  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ Error: " + error.message);
  }
}

// ----------------- User form submission -----------------
userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();

  // Clear previous errors
  document.querySelectorAll("#userForm .error").forEach(el => el.textContent = "");

  let valid = true;
  if (name === "") { document.getElementById("userNameError").textContent = "Name is required"; valid = false; }
  if (!isValidEmail(email)) { document.getElementById("userEmailError").textContent = "Enter a valid email"; valid = false; }
  if (password.length < 6) { document.getElementById("userPasswordError").textContent = "Password must be at least 6 characters"; valid = false; }

  if (!valid) return;

  registerUser({ name, email, password, role: "user" });
});

// ----------------- Seller form submission -----------------
sellerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("sellerName").value.trim();
  const email = document.getElementById("sellerEmail").value.trim();
  const password = document.getElementById("sellerPassword").value.trim();
  const skill = document.getElementById("sellerSkill").value;

  // Clear previous errors
  document.querySelectorAll("#sellerForm .error").forEach(el => el.textContent = "");

  let valid = true;
  if (name === "") { document.getElementById("sellerNameError").textContent = "Name is required"; valid = false; }
  if (!isValidEmail(email)) { document.getElementById("sellerEmailError").textContent = "Enter a valid email"; valid = false; }
  if (password.length < 6) { document.getElementById("sellerPasswordError").textContent = "Password must be at least 6 characters"; valid = false; }
  if (skill === "") { document.getElementById("sellerSkillError").textContent = "Please select a skill"; valid = false; }

  if (!valid) return;

  registerUser({ name, email, password, role: "seller", skill });
});

// ----------------- Google Sign-In (for users only) -----------------
const googleBtn = document.getElementById("googleBtn");
googleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user data
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      profilePic: user.photoURL,
      role: "user",
      signupDate: new Date().toISOString()
    });

    alert("✅ Google signup successful!");
    window.location.href = "user_login.html";

  } catch (error) {
    console.error("Google signup failed:", error);
    alert("❌ Error: " + error.message);
  }
});

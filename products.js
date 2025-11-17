// products.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 🔥 Your Firebase config
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
const db = getFirestore(app);

const productList = document.getElementById("productList");
const filterCategory = document.getElementById("filterCategory");
const filterButton = document.getElementById("filterButton");

// store fetched products so add-to-cart can refer to them
let allProducts = [];

// ✅ Load products from Firestore
async function loadProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    productList.innerHTML = "";

    if (querySnapshot.empty) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }

    allProducts = []; // reset

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const product = { id: doc.id, ...data };
      allProducts.push(product);
    });

    displayProducts(allProducts);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    productList.innerHTML = "<p>Failed to load products.</p>";
  }
}

// ✅ Display product grid and attach listeners
function displayProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML = "<p>No products in this category.</p>";
    return;
  }

  list.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${escapeHtml(product.name)}">
      <h3>${escapeHtml(product.name)}</h3>
      <p><b>Category:</b> ${escapeHtml(product.category || 'General')}</p>
      <p class="product-desc">${escapeHtml(product.description || '')}</p>
      <p class="product-price"><b>Price:</b> ₹${product.price ?? 'N/A'}</p>
      <button class="add-btn" data-index="${index}">🛒 Add to Cart</button>
    `;

    productList.appendChild(productCard);
  });

  // attach add-to-cart listeners
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.dataset.index);
      const selectedProduct = allProducts[index];
      if (!selectedProduct) return;

      addToCart(selectedProduct);
      showTempMessage(`${selectedProduct.name} added to cart ✅`);
    });
  });
}

// ✅ Filter function (called on button click)
function applyFilter() {
  const selectedCategory = filterCategory.value;

  if (selectedCategory === "all") {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p =>
      p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    displayProducts(filtered);
  }
}

// 🔘 When user clicks "Filter" button
filterButton.addEventListener("click", applyFilter);

// 🌀 Optional: Auto-filter when dropdown changes
filterCategory.addEventListener("change", applyFilter);

// ✅ Add product to cart (localStorage)
function addToCart(product) {
  const cartKey = "cart";
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sellerId: product.sellerId || null,
      quantity: 1
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
}

// ✅ Temporary popup message
function showTempMessage(text, duration = 1400) {
  const el = document.createElement("div");
  el.textContent = text;
  el.style.position = "fixed";
  el.style.right = "20px";
  el.style.bottom = "20px";
  el.style.background = "rgba(0,0,0,0.8)";
  el.style.color = "white";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "8px";
  el.style.zIndex = 9999;
  el.style.fontSize = "14px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ✅ Escape HTML to avoid injection
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// initial load
loadProducts();

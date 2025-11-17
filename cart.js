// ====================
// UNIVERSAL CART (used by all users)
// ====================

// Load the global cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM elements
const cartContainer = document.getElementById("cart-container");
const totalDisplay = document.getElementById("cart-total");

// ====================
// RENDER CART
// ====================
function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <p style="text-align:center; font-size:1.1rem;">
        Your cart is empty 🛒
      </p>`;
    totalDisplay.textContent = "";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <div class="quantity">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
    `;
    cartContainer.appendChild(itemDiv);
  });

  totalDisplay.textContent = `Total: ₹${total}`;
}

// ====================
// CHANGE QUANTITY
// ====================
function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ====================
// REMOVE ITEM
// ====================
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ====================
// CLEAR CART
// ====================
function clearCart() {
  localStorage.removeItem("cart");
  cart = [];
  renderCart();
}

// ====================
// INITIAL RENDER
// ====================
renderCart();

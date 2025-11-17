document.addEventListener("DOMContentLoaded", () => {
  const checkoutItemsDiv = document.getElementById("checkout-items");
  const checkoutTotalElem = document.getElementById("checkout-total");
  const payBtn = document.getElementById("rzp-button1");

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if cart is empty
  if (cart.length === 0) {
    checkoutItemsDiv.innerHTML = `<p>Your cart is empty 🛒</p>`;
    checkoutTotalElem.textContent = "";
    payBtn.disabled = true;
    return;
  }

  // Render cart items and calculate total
  let totalAmount = 0;
  checkoutItemsDiv.innerHTML = cart.map(item => {
    const subtotal = item.price * item.quantity;
    totalAmount += subtotal;
    return `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}" width="80">
        <div class="checkout-info">
          <h4>${item.name}</h4>
          <p>₹${item.price} × ${item.quantity}</p>
          <p><strong>Subtotal:</strong> ₹${subtotal}</p>
        </div>
      </div>
    `;
  }).join("");

  checkoutTotalElem.textContent = `Total: ₹${totalAmount}`;

  // Razorpay integration
  payBtn.onclick = function (e) {
    e.preventDefault();

    const options = {
      key: "rzp_test_RPknU2R394sRdz", // Replace with your Test Key ID
      amount: totalAmount * 100, // Convert ₹ to paise
      currency: "INR",
      name: "EmpowerHer",
      description: "Order Payment",
      image: "https://i.postimg.cc/0jZ3Fcwv/Empower-Her.png",
      handler: function (response) {
        alert("✅ Payment Successful! Payment ID: " + response.razorpay_payment_id);
        localStorage.removeItem("cart");
        window.location.href = "success.html";
      },
      prefill: {
        name: "Customer",
        email: "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#D2694C"
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  };
});

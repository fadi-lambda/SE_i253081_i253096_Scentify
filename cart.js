/* ======================================================
   SAMPLE CART DATA (You can replace with real backend)
====================================================== */
let cartItems = [
    
];

// Fixed shipping amount
const SHIPPING = 15;


/* ======================================================
   RENDER CART ITEMS
====================================================== */
function renderCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    cartItems.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            
            <div class="item-details">
                <div class="item-title">${item.name}</div>
                <div class="item-price">$${item.price}</div>

                <div class="quantity-box">
                    <button onclick="decreaseQty(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQty(${item.id})">+</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;

        container.appendChild(div);
    });

    updateSummary();
}


/* ======================================================
   QUANTITY UPDATE FUNCTIONS
====================================================== */
function increaseQty(id) {
    const item = cartItems.find(i => i.id === id);
    item.quantity++;
    renderCart();
}

function decreaseQty(id) {
    const item = cartItems.find(i => i.id === id);
    if (item.quantity > 1) {
        item.quantity--;
        renderCart();
    }
}


/* ======================================================
   REMOVE ITEM
====================================================== */
function removeItem(id) {
    cartItems = cartItems.filter(i => i.id !== id);
    renderCart();
}


/* ======================================================
   UPDATE ORDER SUMMARY
====================================================== */
function updateSummary() {
    let subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let tax = subtotal * 0.10; // 10% tax
    let grandTotal = subtotal + SHIPPING + tax;

    document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("tax").innerText = `$${tax.toFixed(2)}`;
    document.getElementById("shipping").innerText = `$${SHIPPING.toFixed(2)}`;
    document.getElementById("grand-total").innerText = `$${grandTotal.toFixed(2)}`;
}


/* Initialize Cart Rendering */
renderCart();

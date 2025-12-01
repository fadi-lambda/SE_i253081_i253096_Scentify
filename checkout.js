// checkoutpage.js (Checkout Page ka Logic)

document.addEventListener('DOMContentLoaded', () => {
    
    // HTML elements references for Display
    const cartTableBody = document.getElementById('cartTableBody'); 
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartItemsTable = document.getElementById('cartItemsTable');
    const subtotalDisplay = document.getElementById('subtotalDisplay');
    const shippingDisplay = document.getElementById('shippingDisplay');
    const orderTotalDisplay = document.getElementById('orderTotalDisplay');
    const cartItemCount = document.getElementById('cartItemCount'); // Header mein count ke liye
    
    // Form aur Shipping References
    const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Constants
    const FREE_SHIPPING_AMOUNT = 0.00;
    const STANDARD_SHIPPING_AMOUNT = 200.00; 

    // ✅ DATA LOAD LINE: Local Storage se data load karna (productlisting.js se)
    let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    // Check karein ki kaunsa radio button checked hai aur uske mutabiq shuruwaati amount set karein
    let initialShippingRadio = document.querySelector('input[name="shipping_method"]:checked');
    let currentShippingAmount = initialShippingRadio && initialShippingRadio.value === 'free' ? FREE_SHIPPING_AMOUNT : STANDARD_SHIPPING_AMOUNT;

    // --- 1. Cart Items aur Totals Render Karna ---
    function renderCart() {
        if (!cartTableBody) return; 
        cartTableBody.innerHTML = ''; 
        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            // Cart Khali hone par
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartItemsTable) cartItemsTable.style.display = 'none';
        } else {
            // Items Display karna
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (cartItemsTable) cartItemsTable.style.display = 'table';
            
            cart.forEach(item => {
                const itemPrice = parseFloat(item.price);
                const itemQuantity = parseInt(item.quantity);
                const itemTotal = itemPrice * itemQuantity;
                subtotal += itemTotal;
                totalItems += itemQuantity; // Total item count
                
                // Note: Image Path (product1.jpg, etc.)
                const productNumber = item.id.replace('p', ''); 
                const imagePath = `product${productNumber}.jpg`; 

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <img src="${imagePath}" alt="${item.name}" class="cart-item-img" style="margin-right: 10px;">
                            <div style="font-size: 0.9em;">
                                ${item.name} 
                                <span style="display: block; color: #777;">Qty: ${itemQuantity}</span>
                            </div>
                        </div>
                        <span style="font-weight: bold;">Rs. ${itemTotal.toFixed(2)}</span>
                    </td>
                `;
                cartTableBody.appendChild(row);
            });
            
            // Calculations
            const orderTotal = subtotal + currentShippingAmount;

            // Display Totals
            if (subtotalDisplay) subtotalDisplay.textContent = `Rs. ${subtotal.toFixed(2)}`;
            if (shippingDisplay) shippingDisplay.textContent = `Rs. ${currentShippingAmount.toFixed(2)}`;
            if (orderTotalDisplay) orderTotalDisplay.textContent = `Rs. ${orderTotal.toFixed(2)}`;
        }

        // Header mein Cart Item Count update karna
        if (cartItemCount) {
            cartItemCount.textContent = totalItems;
        }
    }
    
    // --- 2. Shipping Change Listener (Calculations Update) ---
    function handleShippingChange(e) {
        if (e.target.value === 'free') {
            currentShippingAmount = FREE_SHIPPING_AMOUNT;
        } else if (e.target.value === 'standard') {
            currentShippingAmount = STANDARD_SHIPPING_AMOUNT;
        }
        renderCart();
    }

    shippingRadios.forEach(radio => {
        radio.addEventListener('change', handleShippingChange);
    });
    
    // --- 3. Place Order Validation Logic ---
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            
            // Cart Empty Validation
            if (cart.length === 0) {
                e.preventDefault(); 
                alert("Please add items to your cart before placing an order.");
                return;
            }
            
            // Agar HTML validation aur Cart validation dono pass ho gaye
            e.preventDefault(); 
            
            alert("Success! Your order has been placed. All required details were filled."); 
            
        });
    }

    // Page load hone par shuruwaati render
    renderCart();
});
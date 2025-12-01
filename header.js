document.addEventListener('DOMContentLoaded', () => {
    
    // HTML elements ko references
    const cartTableBody = document.getElementById('cartTableBody');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartItemsTable = document.getElementById('cartItemsTable');
    const cartSummary = document.getElementById('cartSummary');
    const subtotalDisplay = document.getElementById('subtotalDisplay');
    const orderTotalDisplay = document.getElementById('orderTotalDisplay');
    const shippingAmount = 200.00; // Fixed shipping charge

    // 1. Local Storage se Cart Data load karna
    // ScentifyCart data ko JSON.parse se object mein convert karke nikalte hain
    const cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];

    // 2. Data ko Checkout Page par display aur calculate karna
    function renderCart() {
        // Clear previous content
        cartTableBody.innerHTML = ''; 
        let subtotal = 0;

        if (cart.length === 0) {
            // Agar cart empty hai
            emptyCartMessage.style.display = 'block';
            cartItemsTable.style.display = 'none';
            cartSummary.style.display = 'none';
            
        } else {
            // Cart mein items hain
            emptyCartMessage.style.display = 'none';
            cartItemsTable.style.display = 'table';
            cartSummary.style.display = 'block';

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                // Har item ke liye row banana
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="item-name">${item.name}</td>
                    <td>Rs. ${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td class="item-total">Rs. ${itemTotal.toFixed(2)}</td>
                `;
                cartTableBody.appendChild(row);
            });

            // Final Calculations
            const orderTotal = subtotal + shippingAmount;

            // Display Results
            subtotalDisplay.textContent = `Rs. ${subtotal.toFixed(2)}`;
            shippingDisplay.textContent = `Rs. ${shippingAmount.toFixed(2)}`;
            orderTotalDisplay.textContent = `Rs. ${orderTotal.toFixed(2)}`;

            console.log("Checkout calculated successfully.");
            console.log(`Subtotal: Rs.${subtotal.toFixed(2)}, Total: Rs.${orderTotal.toFixed(2)}`);
        }
    }

    // Function ko run karna jab page load ho
    renderCart();

});
// productlisting.js (Product List Page ka Logic)

document.addEventListener('DOMContentLoaded', () => {
    
    // 🛑 ZAROORI: 'localStorage.clear();' line yahan maujood nahi honi chahiye.

    // 1. Sticky Header Functionality (Agar aap use kar rahe hain)
    const header = document.getElementById('mainHeader');
    const stickyPoint = header ? header.offsetHeight : 0; 
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > stickyPoint) {
                header.classList.add('sticky-header');
            } else {
                header.classList.remove('sticky-header');
            }
        }
    });

    // --- 2. Cart Management Functions ---

    // Cart data ko Local Storage se load karte hain
    let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    
    const cartItemCountEl = document.getElementById('cartItemCount');
    const cartNotificationEl = document.getElementById('cartNotification');

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartItemCountEl) {
            cartItemCountEl.textContent = totalItems;
        }
    }

    function saveCart() {
        // ✅ Data 'scentifyCart' key se save ho raha hai, jo checkout page use karega.
        localStorage.setItem('scentifyCart', JSON.stringify(cart)); 
    }

    function showNotification(productName) {
        if (cartNotificationEl) {
            cartNotificationEl.textContent = `${productName} added to cart!`;
            cartNotificationEl.classList.add('show');
            
            setTimeout(() => {
                cartNotificationEl.classList.remove('show');
            }, 2000); 
        }
    }
    
    // Main Cart Logic: Item ko cart mein add karna
    function addItemToCart(id, name, price) {
        if (!id || !name || !price) {
            console.error("Missing product data for cart:", {id, name, price});
            return; 
        }

        const existingItemIndex = cart.findIndex(item => item.id === id);
        const parsedPrice = parseFloat(price);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: parsedPrice, 
                quantity: 1
            });
        }

        saveCart(); 
        updateCartCount(); 
        showNotification(name); 
    }

    // Click Event Listener: Har 'Add' button par event lagana
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');

            addItemToCart(id, name, price);
        });
    });

    // Page load hone par shuruwaati cart count update karna
    updateCartCount();
});
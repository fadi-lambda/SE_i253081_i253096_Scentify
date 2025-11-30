// === SPA (Single Page Application) Logic ===

/**
 * Ye function sirf main content area ke andar ke pages ko badalta hai. 
 * Header aur Footer hamesha apni jagah par rehte hain.
 * @param {string} pageId - Us section ki ID jise dikhana hai (e.g., 'home-page', 'product-detail-page').
 */
function showPage(pageId) {
    // Tamam content pages ko hide karein
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // Sirf required page ko dikhayein
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block'; 
        // Jab naya page load ho, to scroll top par chala jaye
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Agar product detail page hai, to tabs ko default state par set karein
        if (pageId === 'product-detail-page') {
            // Default tab ko 'Description' par set karein
            const defaultTab = document.getElementById('Description');
            if (defaultTab) {
                // openTab function ko call karne ke liye dummy event object
                const defaultButton = document.querySelector('.details-section .tab-button:first-child');
                if (defaultButton) {
                    openTab({ currentTarget: defaultButton }, 'Description');
                }
            }
        }
    }
}

// === Product Detail Page Specific Logic ===

// Image Gallery ka function
function changeMainImage(thumbnail) {
    document.querySelectorAll('.thumbnail-image').forEach(img => {
        img.classList.remove('active');
    });
    thumbnail.classList.add('active');
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = thumbnail.getAttribute('data-large-src');
}

// Quantity Control ka function
function updateQuantity(delta) {
    const qtyInput = document.getElementById('quantity');
    if (qtyInput) {
        let currentValue = parseInt(qtyInput.value);
        let newValue = currentValue + delta;
        if (newValue >= 1) {
            qtyInput.value = newValue;
        }
    }
}

// Description/Specifications Tab switching ka function
function openTab(evt, tabName) {
    // Sirf product detail page ke andar ke tabs ko handle karein
    const detailsSection = evt.currentTarget.closest('.details-section');
    if (!detailsSection) return;

    // 1. Hide all tab content
    detailsSection.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });

    // 2. Remove 'active' class from all tab buttons
    detailsSection.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Show the current tab content
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block'; 
    }

    // 4. Add 'active' class to the button that opened the tab
    evt.currentTarget.classList.add('active');
}

// Page load par default Home Page dikhayein
window.onload = function() {
    showPage('home-page');
};
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const qtyMinusBtn = document.getElementById('qty-minus');
    const qtyPlusBtn = document.getElementById('qty-plus');
    const quantityInput = document.getElementById('quantity');
    const tabButtons = document.querySelectorAll('.tab-button');
    const descriptionContent = document.getElementById('description-content');
    const specificationsContent = document.getElementById('specifications-content');

    // --- Content Data ---
    const content = {
        description: `
            <div class="description-section">
                <p>Here is Sultan e Ameer with floral-woody accords, this fragrance is enhanced by subtle undertones of musk and citrus, creating an enchanting and captivating scent.</p>
                <div class="note-list mt-4">
                    <p><strong>Top Note:</strong> Bergamot;</p>
                    <p><strong>Middle Notes:</strong> Jasmine, Rose;</p>
                    <p><strong>Base Notes:</strong> Sandalwood, Amber, Oakmoss, Musk</p>
                </div>
            </div>
        `,
        specifications: `
            <div class="specifications-section">
                <p><strong>Variants:</strong> We offer this attar in one format</p>
                <ul>
                    <li><strong>Roll-On Attar:</strong> Available in one size: 16ml.</li>
                </ul>
                <p class="mt-4"><strong>Concentration:</strong></p>
                <ul>
                    <li><strong>Roll-On Attar:</strong> 100% Concentrated</li>
                </ul>
                <p class="mt-4"><strong>Sillage & Lasting:</strong></p>
                <ul>
                    <li><strong>Sillage:</strong> High</li>
                    <li><strong>Lasting Up To:</strong> 8 to 10 hours (measured in a standard atmosphere)</li>
                </ul>
            </div>
        `,
        shippingDetails: `
            <div class="shipping-details">
                <p>Deliveries within Karachi are completed in 2-3 days.</p>
                <p>Deliveries to other cities take 3-4 days.</p>
                <p>Delivery charges are Rs. 200, with free delivery for orders above 3000.</p>
                <p>We offer flash deliveries through our dedicated dispatch center in Karachi.</p>
                <p>Please place your order promptly to receive your product as soon as possible.</p>
                <p>For any queries, call us at (021)35644514 or leave a voice note.</p>
            </div>
        `
    };

    // --- Initialize content ---
    descriptionContent.innerHTML = content.description;
    specificationsContent.innerHTML = content.specifications;

    // --- Image Gallery Logic ---
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const newImageSrc = thumbnail.getAttribute('data-image');
            mainImage.src = newImageSrc;

            // subtle animation
            mainImage.style.transform = 'scale(0.98)';
            setTimeout(() => {
                mainImage.style.transform = 'scale(1)';
            }, 100);

            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
    });

    // --- Quantity Selector Logic ---
    const updateQuantity = (change) => {
        let currentQty = parseInt(quantityInput.value);
        if (isNaN(currentQty)) currentQty = 1;
        let newQty = currentQty + change;
        if (newQty < 1) newQty = 1;
        quantityInput.value = newQty;
        console.log(`Product Quantity updated to: ${newQty}`);
    };

    qtyPlusBtn.addEventListener('click', () => updateQuantity(1));
    qtyMinusBtn.addEventListener('click', () => updateQuantity(-1));

    quantityInput.addEventListener('change', () => {
        let currentQty = parseInt(quantityInput.value);
        if (isNaN(currentQty) || currentQty < 1) {
            quantityInput.value = 1;
        }
    });

    // --- Tab Logic ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // clear active
            tabButtons.forEach(btn => btn.classList.remove('active'));
            descriptionContent.classList.add('hidden');
            specificationsContent.classList.add('hidden');

            // set active button
            button.classList.add('active');

            // show selected content
            if (targetTab === 'description') {
                setTimeout(() => descriptionContent.classList.remove('hidden'), 50);
            } else if (targetTab === 'specifications') {
                setTimeout(() => specificationsContent.classList.remove('hidden'), 50);
            }
        });
    });

    // --- Optional: Show shipping details below shipping-info if needed ---
    // Uncomment if adding shippingDetails somewhere in page dynamically
    // const shippingInfoEl = document.querySelector('.shipping-info');
    // if (shippingInfoEl) {
    //     const div = document.createElement('div');
    //     div.innerHTML = content.shippingDetails;
    //     shippingInfoEl.appendChild(div);
    // }

    // --- Buy/Cart Button Visual Feedback (optional) ---
    const cartBtn = document.querySelector('.add-to-cart-btn');
    const buyBtn = document.querySelector('.buy-now-btn');

    const giveFeedback = (button, message) => {
        const originalText = button.textContent;
        const originalBg = button.style.backgroundColor;
        const originalColor = button.style.color;

        button.textContent = message;
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
            button.style.color = originalColor;
            button.disabled = false;
        }, 1500);
    };

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            giveFeedback(cartBtn, 'Item Added!');
        });
    }
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            giveFeedback(buyBtn, 'Checkout...');
        });
    }
});
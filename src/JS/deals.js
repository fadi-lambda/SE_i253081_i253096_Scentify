// deals.js — Deals & Offers Page
// Reads product data from products.js (already loaded on this page),
// filters/creates deal cards, runs the countdown timer, and handles
// its own "Add to Cart" clicks — fully independent from productpage.js.

document.addEventListener('DOMContentLoaded', () => {

  const dealsGrid   = document.getElementById('dealsGrid');
  const dealsCount  = document.getElementById('dealsCount');
  const dealsNotif  = document.getElementById('dealsNotification');
  const cartCountEl = document.getElementById('cartItemCount');

  // Deal discount percentages per product — edit this to change which
  // products are "on deal" and by how much. Products not listed here
  // simply won't appear on the deals page.
  const dealDiscounts = {
    "sultan-e-ameer": 15,
    "black-silver-oudh": 20,
    "white-oudh": 25,
    "mysterious-oudh": 30
  };

  function refreshCartCount() {
    if (!cartCountEl) return;
    const cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = total;
  }

  function showDealsNotification(name) {
    if (!dealsNotif) return;
    dealsNotif.textContent = `${name} added to cart!`;
    dealsNotif.style.display = 'block';
    setTimeout(() => { dealsNotif.style.display = 'none'; }, 2000);
  }

  function addDealToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price: parseFloat(price), quantity: 1 });
    }

    localStorage.setItem('scentifyCart', JSON.stringify(cart));
    refreshCartCount();
    showDealsNotification(name);
  }

  function renderDeals() {
    if (!dealsGrid || typeof products === 'undefined') return;

    const dealIds = Object.keys(dealDiscounts);

    if (dealIds.length === 0) {
      dealsGrid.innerHTML = `<p class="deals-empty-state">No active deals right now — check back soon!</p>`;
      if (dealsCount) dealsCount.textContent = '0 deals';
      return;
    }

    if (dealsCount) dealsCount.textContent = `${dealIds.length} deals`;

    dealsGrid.innerHTML = dealIds.map(id => {
      const product = products[id];
      if (!product) return '';

      const discountPct = dealDiscounts[id];
      const dealPrice = Math.round(product.price * (1 - discountPct / 100));
      const image = product.images && product.images[0] ? product.images[0] : '';

      return `
        <article class="deal-card" data-price="${dealPrice}">
          <span class="deal-discount-ribbon">-${discountPct}%</span>
          <a href="product-detail.html?id=${id}" class="deal-card-img-link">
            <div class="deal-card-img-wrapper">
              <img src="${image}" alt="${product.name}" loading="lazy">
            </div>
          </a>
          <div class="deal-card-details">
            <a href="product-detail.html?id=${id}" class="deal-card-title">${product.name}</a>
            <div class="deal-price-row">
              <span class="deal-old-price">Rs. ${product.price.toLocaleString()}</span>
              <span class="deal-current-price">Rs. ${dealPrice.toLocaleString()}</span>
            </div>
            <button class="deal-add-btn" data-id="${id}" data-name="${product.name}" data-price="${dealPrice}">
              <i class="fas fa-shopping-cart" aria-hidden="true"></i> Add to Cart
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click handlers to the newly created buttons
    document.querySelectorAll('.deal-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        addDealToCart(
          btn.getAttribute('data-id'),
          btn.getAttribute('data-name'),
          btn.getAttribute('data-price')
        );
      });
    });
  }

  // --- Countdown Timer ---
  // Counts down to midnight (resets daily) — purely visual urgency element
  function startCountdown() {
    const hoursEl   = document.getElementById('cdHours');
    const minutesEl = document.getElementById('cdMinutes');
    const secondsEl = document.getElementById('cdSeconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;

      const hours   = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      hoursEl.textContent   = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  refreshCartCount();
  renderDeals();
  startCountdown();
});
// productpage.js — Product Listing Page

document.addEventListener('DOMContentLoaded', () => {

  let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
  const cartItemCountEl = document.getElementById('cartItemCount');
  const cartNotificationEl = document.getElementById('cartNotification');
  const sortSelect = document.getElementById('sortSelect');
  const productGrid = document.getElementById('productGrid');
  const resultsCountEl = document.getElementById('resultsCount');
  const searchInput = document.getElementById('desktop-search');
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('query') || '';

  // --- Cart Count ---
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartItemCountEl) cartItemCountEl.textContent = total;
  }

  function normalizeSearchText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function updateResultsCount(visibleCount, totalCount) {
    if (!resultsCountEl) return;
    resultsCountEl.textContent = visibleCount === totalCount
      ? `${totalCount} products`
      : `${visibleCount} of ${totalCount} products`;
  }

  function ensureNoResultsMessage(show) {
    if (!productGrid) return;

    let message = document.getElementById('noSearchResultsMessage');
    if (!show) {
      if (message) message.remove();
      return;
    }

    if (!message) {
      message = document.createElement('div');
      message.id = 'noSearchResultsMessage';
      message.className = 'empty-cart-msg';
      message.style.gridColumn = '1 / -1';
      message.style.marginTop = '16px';
      message.textContent = 'No products matched your search. Try a different name or browse all products.';
      productGrid.after(message);
    }
  }

  function filterProducts(query) {
    if (!productGrid) return;

    const normalizedQuery = normalizeSearchText(query);
    const cards = Array.from(productGrid.querySelectorAll('.pl-product-card'));
    let visibleCount = 0;

    cards.forEach(card => {
      const searchableText = normalizeSearchText(card.textContent);
      const matches = !normalizedQuery || searchableText.includes(normalizedQuery);
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount += 1;
    });

    updateResultsCount(visibleCount, cards.length);
    ensureNoResultsMessage(visibleCount === 0 && normalizedQuery.length > 0);
  }

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  function saveCart() {
    localStorage.setItem('scentifyCart', JSON.stringify(cart));
  }

  function showNotification(name) {
    if (!cartNotificationEl) return;
    cartNotificationEl.textContent = `${name} added to cart!`;
    cartNotificationEl.style.display = 'block';
    setTimeout(() => { cartNotificationEl.style.display = 'none'; }, 2000);
  }

  function addItemToCart(id, name, price) {
    if (!id || !name || !price) return;
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ id, name, price: parseFloat(price), quantity: 1 });
    }
    saveCart();
    updateCartCount();
    showNotification(name);
  }

  // --- Add to Cart Buttons (updated selector) ---
  document.querySelectorAll('.pl-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addItemToCart(
        btn.getAttribute('data-id'),
        btn.getAttribute('data-name'),
        btn.getAttribute('data-price')
      );
    });
  });

  // --- Sort ---
  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(productGrid.querySelectorAll('.pl-product-card'));
      const val = sortSelect.value;

      cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const ratingA = parseFloat(a.dataset.rating);
        const ratingB = parseFloat(b.dataset.rating);

        if (val === 'price-asc') return priceA - priceB;
        if (val === 'price-desc') return priceB - priceA;
        if (val === 'rating') return ratingB - ratingA;
        return 0; // default/featured
      });

      cards.forEach(card => productGrid.appendChild(card));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterProducts(searchInput.value);
    });
  }

  filterProducts(initialQuery);

  updateCartCount();
});
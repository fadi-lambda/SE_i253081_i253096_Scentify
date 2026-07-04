// script.js — Scentify Global Script

// Tab switching (Product Detail Page)
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName('tab-content');
  const tabButtons = document.getElementsByClassName('tab-button');

  for (let i = 0; i < tabContents.length; i++) tabContents[i].classList.remove('active');
  for (let i = 0; i < tabButtons.length; i++) tabButtons[i].classList.remove('active');

  const target = document.getElementById(tabName);
  if (target) target.classList.add('active');
  if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
}

// Quantity control (Product Detail Page)
function updateQuantity(change) {
  const qtyInput = document.getElementById('quantity');
  if (!qtyInput) return;
  let newQty = parseInt(qtyInput.value) + change;
  qtyInput.value = Math.max(1, newQty);
}

// Thumbnail image switcher (Product Detail Page)
function changeMainImage(thumbnail) {
  const mainImage = document.getElementById('main-product-image');
  if (!mainImage) return;
  mainImage.src = thumbnail.src;
  mainImage.alt = thumbnail.alt;
  document.querySelectorAll('.thumbnail-image').forEach(img => img.classList.remove('active'));
  thumbnail.classList.add('active');
}

const PRODUCT_SEARCH_INDEX = [
  { id: 'sultan-e-ameer', name: 'Sultan E Ameer', aliases: ['sultan', 'ameer', 'sultan e ameer', 'addition to arabia'] },
  { id: 'black-silver-platinum', name: 'Black & Silver Platinum', aliases: ['black silver platinum', 'platinum'] },
  { id: 'black-silver-oudh', name: 'Black & Silver Oudh', aliases: ['black silver oudh', 'mysterious oudh', 'oudh'] },
  { id: 'white-oudh', name: 'White Oudh', aliases: ['white oudh'] },
  { id: 'ameer-oudh', name: 'Ameer Al Oud', aliases: ['ameer al oud', 'ameer oud', 'ameer al oudh'] },
  { id: 'black-n-gold', name: 'Black N Gold', aliases: ['black n gold', 'black and gold'] },
  { id: 'mysterious-oudh', name: 'Mysterious Oudh', aliases: ['mysterious oudh', 'mysterious'] }
];

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function findProductForSearch(query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return null;

  const exactMatch = PRODUCT_SEARCH_INDEX.find(product => {
    if (normalizeSearchText(product.id) === normalizedQuery) return true;
    if (normalizeSearchText(product.name) === normalizedQuery) return true;
    return product.aliases.some(alias => normalizeSearchText(alias) === normalizedQuery);
  });

  if (exactMatch) return exactMatch;

  return PRODUCT_SEARCH_INDEX.find(product => {
    if (normalizeSearchText(product.id).includes(normalizedQuery)) return true;
    if (normalizeSearchText(product.name).includes(normalizedQuery)) return true;
    return product.aliases.some(alias => normalizeSearchText(alias).includes(normalizedQuery));
  }) || null;
}

function openSearchResults(query) {
  const trimmedQuery = String(query || '').trim();
  if (!trimmedQuery) return;

  const match = findProductForSearch(trimmedQuery);
  if (match && normalizeSearchText(match.name) === normalizeSearchText(trimmedQuery)) {
    window.location.href = `product-detail.html?id=${match.id}`;
    return;
  }

  if (match && normalizeSearchText(match.id) === normalizeSearchText(trimmedQuery)) {
    window.location.href = `product-detail.html?id=${match.id}`;
    return;
  }

  window.location.href = `productlisting.html?query=${encodeURIComponent(trimmedQuery)}`;
}

function bindSearchControls() {
  const searchInputs = Array.from(document.querySelectorAll('#desktop-search'));
  const searchButtons = Array.from(document.querySelectorAll('.search-mobile-icon'));
  const searchIcons = Array.from(document.querySelectorAll('.search-input-wrapper .fa-search'));

  searchInputs.forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        openSearchResults(input.value);
      }
    });
  });

  searchIcons.forEach(icon => {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', () => {
      const wrapper = icon.closest('.search-input-wrapper');
      const input = wrapper ? wrapper.querySelector('#desktop-search') : null;
      if (input) openSearchResults(input.value);
    });
  });

  searchButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const header = button.closest('.header-main') || document;
      const input = header.querySelector('#desktop-search');

      if (input && input.value.trim()) {
        openSearchResults(input.value);
        return;
      }

      if (input) {
        input.focus();
        input.select();
      }
    });
  });
}

// Global cart count sync on every page
document.addEventListener('DOMContentLoaded', () => {
  const cartCountEl = document.querySelector('.cart-count');

  function refreshCartCount() {
    if (!cartCountEl) return;
    const cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = total;
  }

  refreshCartCount();

  // Initialise first tab on detail page if present
  const firstTabBtn = document.querySelector('.tab-button');
  const firstTabContent = document.getElementById('Description');
  if (firstTabBtn) firstTabBtn.classList.add('active');
  if (firstTabContent) firstTabContent.classList.add('active');

  bindSearchControls();

  // Homepage "Add to Cart" buttons (.card-cart-btn)
  document.querySelectorAll('.card-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent the parent <a> from navigating

      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));

      if (!id || !name || !price) return;

      let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      localStorage.setItem('scentifyCart', JSON.stringify(cart));
      refreshCartCount();

      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Added!';
      setTimeout(() => { btn.innerHTML = originalHTML; }, 1200);
    });
  });
});
// checkout.js — Checkout Page

document.addEventListener('DOMContentLoaded', () => {

  const cartItemsList    = document.getElementById('cartItemsList');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const subtotalDisplay  = document.getElementById('subtotalDisplay');
  const shippingDisplay  = document.getElementById('shippingDisplay');
  const orderTotalDisplay= document.getElementById('orderTotalDisplay');
  const cartItemCount    = document.getElementById('cartItemCount');
  const checkoutForm     = document.getElementById('checkoutForm');
  const shippingRadios   = document.querySelectorAll('input[name="shipping_method"]');

  const FREE_SHIPPING     = 0;
  const STANDARD_SHIPPING = 200;
  const LEGACY_PRODUCT_IDS = {
    p1: 'sultan-e-ameer',
    p2: 'black-silver-platinum',
    p3: 'black-silver-oudh',
    p4: 'white-oudh',
    p5: 'black-n-gold',
    p6: 'ameer-oudh',
    p7: 'mysterious-oudh',
    'ameer-al-oudh': 'ameer-oudh'
  };

  function normalizeCartItem(item) {
    const normalizedId = LEGACY_PRODUCT_IDS[item.id] || item.id;
    return {
      ...item,
      id: normalizedId,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    };
  }

  function getCartImage(item) {
    const product = typeof products !== 'undefined' ? products[item.id] : null;
    if (product && product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (item.image) return item.image;
    if (item.id) return `../../Images/Products/${item.id}/1.webp`;
    return '../../Images/Products/sultan-e-ameer/1.webp';
  }

  function saveCart() {
    localStorage.setItem('scentifyCart', JSON.stringify(cart));
  }

  let cart = (JSON.parse(localStorage.getItem('scentifyCart')) || []).map(normalizeCartItem);
  saveCart();

  function getShippingCost() {
    const checked = document.querySelector('input[name="shipping_method"]:checked');
    return checked && checked.value === 'free' ? FREE_SHIPPING : STANDARD_SHIPPING;
  }

  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = 'block';
      if (subtotalDisplay) subtotalDisplay.textContent = 'Rs. 0';
      if (shippingDisplay) shippingDisplay.textContent = 'Rs. 0';
      if (orderTotalDisplay) orderTotalDisplay.textContent = 'Rs. 0';
    } else {
      if (emptyCartMessage) emptyCartMessage.style.display = 'none';

      cart.forEach(item => {
        const itemTotal = Number(item.price) * Number(item.quantity);
        subtotal += itemTotal;
        totalItems += item.quantity;

        const div = document.createElement('div');
        div.className = 'checkout-cart-item';
        div.innerHTML = `
          <img class="checkout-item-image" src="${getCartImage(item)}" alt="${item.name}" loading="lazy">
          <div class="checkout-cart-item-info">
            <div class="checkout-item-header">
              <span class="checkout-item-name">${item.name}</span>
              <button type="button" class="checkout-remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">Remove</button>
            </div>
            <span class="checkout-item-price">Rs. ${Number(item.price).toLocaleString()}</span>
            <div class="checkout-qty-controls" aria-label="Adjust quantity for ${item.name}">
              <button type="button" class="checkout-qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity for ${item.name}">−</button>
              <span class="checkout-item-qty">Qty: ${item.quantity}</span>
              <button type="button" class="checkout-qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity for ${item.name}">+</button>
            </div>
          </div>
          <span class="checkout-item-total">Rs. ${itemTotal.toLocaleString()}</span>
        `;
        cartItemsList.appendChild(div);
      });

      const shipping = getShippingCost();
      const total = subtotal + shipping;

      if (subtotalDisplay)   subtotalDisplay.textContent   = `Rs. ${subtotal.toLocaleString()}`;
      if (shippingDisplay)   shippingDisplay.textContent   = shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`;
      if (orderTotalDisplay) orderTotalDisplay.textContent = `Rs. ${total.toLocaleString()}`;
    }

    if (cartItemCount) cartItemCount.textContent = totalItems;
  }

  function updateItemQuantity(itemId, delta) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index === -1) return;

    const nextQuantity = cart[index].quantity + delta;
    if (nextQuantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = nextQuantity;
    }

    saveCart();
    renderCart();
  }

  function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCart();
  }

  if (cartItemsList) {
    cartItemsList.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const itemId = button.dataset.id;
      const action = button.dataset.action;

      if (action === 'increase') updateItemQuantity(itemId, 1);
      if (action === 'decrease') updateItemQuantity(itemId, -1);
      if (action === 'remove') removeItem(itemId);
    });
  }

  shippingRadios.forEach(r => r.addEventListener('change', renderCart));

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
      }
      alert('Order placed successfully! Thank you for shopping with Scentify.');
      localStorage.removeItem('scentifyCart');
      cart = [];
      renderCart();
    });
  }

  renderCart();
});
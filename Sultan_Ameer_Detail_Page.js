
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, onSnapshot, collection, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        import { setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        
        // Set Firebase log level for debugging
        setLogLevel('Debug');
        
        // --- Global Variables and Constants ---
        const products = [
            { id: 'p1', name: 'Digital Course Pack', price: 49.99, image: 'https://placehold.co/100x100/4f46e5/ffffff?text=Course' },
            { id: 'p2', name: 'Web Dev Ebook', price: 19.99, image: 'https://placehold.co/100x100/10b981/ffffff?text=Ebook' },
            { id: 'p3', name: 'Premium Mockup Kit', price: 99.00, image: 'https://placehold.co/100x100/f59e0b/ffffff?text=Mockup' },
            { id: 'p4', name: '1-on-1 Coaching Session', price: 149.99, image: 'https://placehold.co/100x100/ef4444/ffffff?text=Coaching' }
        ];

        let db;
        let auth;
        let userId = null;
        let cartState = []; // Local representation of the cart
        let cartRef = null;

        // --- DOM Elements ---
        const productListEl = document.getElementById('product-list');
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        const cartItemCountEl = document.getElementById('cart-item-count');
        const emptyCartMessageEl = document.getElementById('empty-cart-message');
        const checkoutButtonEl = document.getElementById('checkout-button');
        const clearCartButtonEl = document.getElementById('clear-cart-button');
        const loadingMessageEl = document.getElementById('loading-message');
        const userIdDisplayEl = document.getElementById('user-id-display');


        // --- Utility Functions ---

        /**
         * Safely gets the global App ID from the Canvas environment.
         */
        const getAppId = () => typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        /**
         * Calculates the total price of the items in the cart.
         * @param {Array<Object>} items - The cart items array.
         * @returns {number} The total price.
         */
        const calculateTotal = (items) => {
            return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        };

        /**
         * Formats a number as a currency string.
         * @param {number} amount - The number to format.
         * @returns {string} The formatted currency string.
         */
        const formatCurrency = (amount) => {
            return `$${amount.toFixed(2)}`;
        };


        // --- Firestore Functions ---

        /**
         * Gets the Firestore document reference for the current user's cart.
         * @returns {import("firebase/firestore").DocumentReference}
         */
        const getCartDocumentRef = () => {
            const appId = getAppId();
            // Path: /artifacts/{appId}/users/{userId}/shoppingCart/currentCart
            const cartCollectionPath = `/artifacts/${appId}/users/${userId}/shoppingCart`;
            return doc(db, cartCollectionPath, 'currentCart');
        };

        /**
         * Initializes the Firestore listener for the user's cart.
         */
        const startCartListener = () => {
            if (!db || !userId) {
                console.warn("Firestore or UserId not ready. Cannot start listener.");
                return;
            }

            cartRef = getCartDocumentRef();
            loadingMessageEl.classList.remove('hidden');

            // Set up real-time listener
            onSnapshot(cartRef, (docSnap) => {
                loadingMessageEl.classList.add('hidden');
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Firestore cart items are stored as an array of objects
                    cartState = data.items || [];
                    console.log("Cart data updated from Firestore:", cartState);
                } else {
                    // Document doesn't exist, initialize it with an empty array
                    cartState = [];
                    console.log("Cart document does not exist. Initializing local cart state.");
                }
                // Always re-render the UI after a successful fetch or update
                renderCart();
            }, (error) => {
                console.error("Error listening to cart changes:", error);
                loadingMessageEl.classList.add('hidden');
            });
        };

        /**
         * Saves the current local cart state to Firestore.
         */
        const saveCartToFirestore = async (newCartItems) => {
            if (!cartRef) {
                console.error("Cart reference not initialized.");
                return;
            }
            loadingMessageEl.classList.remove('hidden');
            try {
                // The setDoc merge option is used to create the document if it doesn't exist,
                // and update only the 'items' field if it does.
                await setDoc(cartRef, { items: newCartItems }, { merge: true });
                console.log("Cart successfully written to Firestore!");
            } catch (error) {
                console.error("Error writing cart to Firestore: ", error);
            }
            // Note: The loading indicator will be hidden by the onSnapshot callback.
        };

        // --- Cart Operations ---

        /**
         * Adds a product to the cart or increments its quantity.
         * @param {string} productId - ID of the product to add.
         */
        window.addItemToCart = (productId) => {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const existingItemIndex = cartState.findIndex(item => item.id === productId);
            let newCartItems = [...cartState];

            if (existingItemIndex > -1) {
                // Item exists, increment quantity
                newCartItems[existingItemIndex].quantity += 1;
            } else {
                // Item does not exist, add it
                newCartItems.push({ 
                    id: product.id, 
                    name: product.name, 
                    price: product.price, 
                    quantity: 1,
                    image: product.image 
                });
            }
            
            saveCartToFirestore(newCartItems);
        };

        /**
         * Decrements the quantity of a product in the cart, removing it if quantity hits zero.
         * @param {string} productId - ID of the product to remove.
         */
        window.removeItemFromCart = (productId) => {
            const existingItemIndex = cartState.findIndex(item => item.id === productId);
            if (existingItemIndex === -1) return;

            let newCartItems = [...cartState];
            
            if (newCartItems[existingItemIndex].quantity > 1) {
                // Decrement quantity
                newCartItems[existingItemIndex].quantity -= 1;
            } else {
                // Remove item completely
                newCartItems.splice(existingItemIndex, 1);
            }

            saveCartToFirestore(newCartItems);
        };

        /**
         * Clears all items from the cart.
         */
        window.clearCart = () => {
            saveCartToFirestore([]);
        };

        // Attach clear cart functionality to the button
        clearCartButtonEl.onclick = () => window.clearCart();

        // --- Rendering Functions ---

        /**
         * Renders the list of products available to the DOM.
         */
        const renderProducts = () => {
            productListEl.innerHTML = products.map(product => `
                <div class="p-4 border border-gray-100 rounded-lg shadow-sm flex items-center space-x-4">
                    <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-lg object-cover">
                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-indigo-600 font-bold">${formatCurrency(product.price)}</p>
                    </div>
                    <button 
                        onclick="addItemToCart('${product.id}')" 
                        class="bg-green-500 text-white p-2 rounded-lg text-sm font-medium hover:bg-green-600 transition duration-300 shadow-md">
                        Add
                    </button>
                </div>
            `).join('');
        };

        /**
         * Renders the current state of the cart to the DOM.
         */
        const renderCart = () => {
            // Check if cart is empty
            const isEmpty = cartState.length === 0;

            emptyCartMessageEl.classList.toggle('hidden', !isEmpty);
            cartItemsEl.innerHTML = isEmpty ? '' : cartState.map(item => `
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg shadow-inner">
                    <div class="flex-grow">
                        <p class="text-sm font-medium text-gray-800">${item.name}</p>
                        <p class="text-xs text-gray-500">${formatCurrency(item.price)} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button 
                            onclick="removeItemFromCart('${item.id}')" 
                            class="text-red-500 border border-red-500 hover:bg-red-50 text-xs p-1 rounded transition duration-200"
                            title="Remove one unit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                                <path fill-rule="evenodd" d="M3.75 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <span class="font-semibold text-sm w-4 text-center">${item.quantity}</span>
                        <button 
                            onclick="addItemToCart('${item.id}')" 
                            class="text-green-500 border border-green-500 hover:bg-green-50 text-xs p-1 rounded transition duration-200"
                            title="Add one unit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');

            // Update total and counts
            const total = calculateTotal(cartState);
            const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);

            cartTotalEl.textContent = formatCurrency(total);
            cartItemCountEl.textContent = totalItems;
            
            // Enable/Disable buttons
            checkoutButtonEl.disabled = isEmpty;
            clearCartButtonEl.disabled = isEmpty;
        };


        // --- Initialization ---

        /**
         * Main initialization function for Firebase and App logic.
         */
        const initializeAppAndAuth = async () => {
            console.log("Starting Firebase initialization...");
            
            const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
            
            if (Object.keys(firebaseConfig).length === 0) {
                console.error("Firebase config is empty. Cannot initialize.");
                // Fallback: Run app without persistence
                renderProducts();
                renderCart();
                return;
            }

            try {
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);
                
                // 1. Attempt to sign in with the custom token if provided
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    // 2. Fallback to anonymous sign-in
                    await signInAnonymously(auth);
                }

                // Wait for auth state to settle
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        userId = user.uid;
                        userIdDisplayEl.textContent = `User ID: ${userId.substring(0, 8)}...`;
                        console.log(`Authenticated with User ID: ${userId}`);
                        
                        // Authentication complete, now start Firestore listener
                        startCartListener();
                        
                    } else {
                        console.error("Authentication failed or user logged out.");
                    }
                });

            } catch (error) {
                console.error("Error during Firebase initialization or sign-in:", error);
                // If sign-in fails, default to running the app without persistence
                userIdDisplayEl.textContent = `User ID: No Auth (Local Only)`;
            }
            
            // Render static products regardless of auth success
            renderProducts();
        };

        // Start the application
        window.onload = initializeAppAndAuth;
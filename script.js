        function openTab(evt, tabName) {
            // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tab-content" and hide them
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].classList.remove('active');
            }

            // Get all elements with class="tab-button" and remove the class "active"
            tablinks = document.getElementsByClassName("tab-button");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].classList.remove('active');
            }

            // Show the current tab, and add an "active" class to the button that opened the tab
            document.getElementById(tabName).classList.add('active');
            evt.currentTarget.classList.add('active');
        }

        // Page switching logic (Home to Product Detail)
        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.content-page');
            pages.forEach(page => {
                page.classList.remove('active');
            });

            // Show the requested page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        // Product quantity update logic
        function updateQuantity(change) {
            const qtyInput = document.getElementById('quantity');
            let currentQty = parseInt(qtyInput.value);
            let newQty = currentQty + change;
            
            if (newQty < 1) {
                newQty = 1; // Minimum quantity is 1
            }
            
            qtyInput.value = newQty;
        }

        // Thumbnail image switching logic
        function changeMainImage(thumbnail) {
            const mainImage = document.getElementById('main-product-image');
            // Change the main image source to the thumbnail source
            mainImage.src = thumbnail.src;
            mainImage.alt = thumbnail.alt;

            // Update active state for thumbnails
            const thumbnails = document.querySelectorAll('.thumbnail-image');
            thumbnails.forEach(img => img.classList.remove('active'));
            thumbnail.classList.add('active');
        }

        // Initialize: Show home page and activate first tab on product detail page load
        window.onload = function() {
            // Ensure the home page is active on initial load
            showPage('home-page');
            
            // Activate the default tab (Description)
            const defaultTab = document.getElementById('Description');
            if (defaultTab) {
                defaultTab.classList.add('active');
            }
            const defaultButton = document.querySelector('.tab-button');
             if (defaultButton) {
                defaultButton.classList.add('active');
            }
        };
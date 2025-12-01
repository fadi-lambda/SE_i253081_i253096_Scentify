document.addEventListener('DOMContentLoaded', () => {
            const mainImage = document.getElementById('main-product-image');
            const thumbnails = document.querySelectorAll('.thumbnail');

            // 2. Clickable Image Gallery Logic
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', (e) => {
                    const newImageSrc = e.currentTarget.getAttribute('data-image');

                    // Change main image source
                    mainImage.src = newImageSrc;

                    // Update active thumbnail border
                    thumbnails.forEach(t => t.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                });
            });

            // Quantity selector logic
            const qtyInput = document.getElementById('quantity');
            document.getElementById('qty-plus').addEventListener('click', () => {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            });
            document.getElementById('qty-minus').addEventListener('click', () => {
                let current = parseInt(qtyInput.value);
                if (current > 1) {
                    qtyInput.value = current - 1;
                }
            });
        });

        // 3. Clickable Description/Specifications Tabs Logic
        function switchTab(tabName) {
            // Get all tab buttons and content sections
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            // Deactivate all buttons and hide all content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate the selected button and show the corresponding content
            if (tabName === 'description') {
                document.getElementById('desc-tab').classList.add('active');
                document.getElementById('description-content').classList.add('active');
            } else if (tabName === 'specifications') {
                document.getElementById('spec-tab').classList.add('active');
                document.getElementById('specifications-content').classList.add('active');
            }
        }
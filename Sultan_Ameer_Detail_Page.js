document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (e) => {
            const newImageSrc = e.currentTarget.getAttribute('data-image');
            mainImage.src = newImageSrc;
            thumbnails.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

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

function switchTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    if (tabName === 'description') {
        document.getElementById('desc-tab').classList.add('active');
        document.getElementById('description-content').classList.add('active');
    } else if (tabName === 'specifications') {
        document.getElementById('spec-tab').classList.add('active');
        document.getElementById('specifications-content').classList.add('active');
    }
}
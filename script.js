function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}
function showPage(pageId) {
    const pages = document.querySelectorAll('.content-page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
function updateQuantity(change) {
    const qtyInput = document.getElementById('quantity');
    let currentQty = parseInt(qtyInput.value);
    let newQty = currentQty + change;

    if (newQty < 1) {
        newQty = 1;
    }

    qtyInput.value = newQty;
}
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = thumbnail.src;
    mainImage.alt = thumbnail.alt;
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    thumbnails.forEach(img => img.classList.remove('active'));
    thumbnail.classList.add('active');
}
window.onload = function () {
    showPage('home-page');
    const defaultTab = document.getElementById('Description');
    if (defaultTab) {
        defaultTab.classList.add('active');
    }
    const defaultButton = document.querySelector('.tab-button');
    if (defaultButton) {
        defaultButton.classList.add('active');
    }
};
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Header Functionality ---
    const mainHeader = document.querySelector('.main-header');
    
    if (mainHeader) {
        const handleScroll = () => {
            // Header ko 'sticky' banane ka threshold (misal ke taur par 50px scroll hone par)
            const stickyThreshold = 50; 
            
            if (window.scrollY > stickyThreshold) {
                // Agar user 50px se zyada scroll karta hai, toh 'sticky' class lagao
                mainHeader.classList.add('sticky');
            } else {
                // Warna 'sticky' class hata do
                mainHeader.classList.remove('sticky');
            }
        };

        // Scroll event listener joda
        window.addEventListener('scroll', handleScroll);
        
        // Page load hone par bhi check karo (agar user ne page reload kiya aur woh beech mein hai)
        handleScroll(); 
    }

    // --- 2. Search Bar Interaction ---
    // Jab user search bar par click kare, toh use highlight karo
    const searchBar = document.querySelector('.search-bar');
    
    if (searchBar) {
        searchBar.addEventListener('click', (e) => {
            // 'active' class lagana/hatana (CSS mein define kiya gaya hai)
            searchBar.classList.toggle('active');
            
            // Agar aap chaho toh input par focus bhi kar sakte ho
            const searchInput = searchBar.querySelector('input');
            if (searchBar.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }
});
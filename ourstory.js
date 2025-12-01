/**
 * ourstory.js
 * * Yeh code Header ki functionality (jaise ki sticky class) ko control karta hai.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const mainHeader = document.querySelector('.main-header');
    
    if (mainHeader) {
        const handleScroll = () => {
            const stickyThreshold = 50; 
            
            if (window.scrollY > stickyThreshold) {
                // Future use ke liye: scroll hone par chota header ya shadow add karne ke liye
                // mainHeader.classList.add('scrolled'); 
                
            } else {
                // mainHeader.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); 
    }
});
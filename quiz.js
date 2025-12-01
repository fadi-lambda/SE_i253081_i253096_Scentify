
document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.querySelector('.quiz-form');
    const questionBlocks = document.querySelectorAll('.question-block');
    const nextButton = document.querySelector('.next-button');
    const resultSection = document.getElementById('result-section');
    const progressIndicators = document.querySelectorAll('.progress-indicator');
    const progressText = document.getElementById('progress-text');
    const totalQuestions = questionBlocks.length;
    let currentQuestionIndex = 0;
    let answers = {};

    function updateProgress() {
        const answeredCount = Object.keys(answers).length;
        progressIndicators.forEach((indicator, index) => {
            if (index < answeredCount) {
                indicator.classList.add('answered');
            } else {
                indicator.classList.remove('answered');
            }
        });
        if (resultSection.style.display === 'block') {
            progressText.textContent = `Progress: Q${totalQuestions}/${totalQuestions}`;
        } else {
            progressText.textContent = `Progress: Q${currentQuestionIndex + 1}/${totalQuestions}`;
        }
        if (answeredCount === totalQuestions) {
            nextButton.textContent = 'Suggest My Perfume';
            nextButton.disabled = false;
        } else {
            nextButton.textContent = 'Next Question';
        }
    }

    function showQuestion(index) {
        questionBlocks.forEach(block => block.classList.remove('active'));
        if (questionBlocks[index]) {
            questionBlocks[index].classList.add('active');
            currentQuestionIndex = index;
            checkButtonState();
        }
        updateProgress();
    }

    function checkButtonState() {
        const currentQuestionName = questionBlocks[currentQuestionIndex].querySelector('input[type="radio"]').name;
        const isAnswered = document.querySelector(`input[name="${currentQuestionName}"]:checked`);

        nextButton.disabled = !isAnswered;
    }

    const radioInputs = document.querySelectorAll('.quiz-form input[type="radio"]');

    radioInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const questionName = event.target.name;
            const card = event.target.closest('.option-card');
            document.querySelectorAll(`input[name="${questionName}"]`).forEach(
                radio => radio.closest('.option-card').classList.remove('selected')
            );
            if (event.target.checked) {
                card.classList.add('selected');
                answers[questionName] = event.target.value;
                checkButtonState();
                updateProgress();
            }
        });
    });

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const answeredCount = Object.keys(answers).length;

        if (answeredCount < totalQuestions) {
            showQuestion(currentQuestionIndex + 1);
        } else if (answeredCount === totalQuestions) {
            showResult();
        }
    });

    function showResult() {
        progressIndicators.forEach(indicator => indicator.classList.add('answered'));

        quizForm.style.display = 'none';
        resultSection.style.display = 'block';

        const season = answers['season'];
        const startDay = answers['start_day'];
        const personality = answers['personality'];

        let title, description, image, link, notes;

        title = "Scentify Signature Musk";
        description = "You have a balanced and versatile personality. Try our signature fragrance: a classic musk with a hint of warm spice.";
        image = "https://muskalmahalpakistan.com/cdn/shop/files/WhatsApp_Image_2025-09-05_at_5.32.56_PM.jpg?v=1759345056&width=1800";
        link = "https://example.com/signature-musk";
        notes = "Notes: Creamy Musk, Sandalwood, Cardamom.";

        if ((season === 'spring' || season === 'summer') && startDay === 'active' && personality === 'fresh') {
            title = "Aqua Citrus Wave";
            description = "Your active and fresh personality calls for a light, invigorating scent. This fragrance is perfect for daily wear and warm weather.";
            image = "https://muskalmahalpakistan.com/cdn/shop/files/Render_0033_Ameeraloud.jpg?v=1759345772&width=1800";
            link = "https://example.com/aqua-citrus";
            notes = "Notes: Zesty Lemon, Green Tea, Marine Accord.";
        }

        else if ((season === 'autumn' || season === 'winter') && startDay === 'refined' && personality === 'mysterious') {
            title = "Oud Noir Elite";
            description = "Bold, mysterious, and refined. You need a luxurious, long-lasting scent with depth. The perfect evening wear or signature scent.";
            image = "https://muskalmahalpakistan.com/cdn/shop/files/Render_0008_platinum.jpg?v=1759344844&width=1800";
            link = "https://example.com/oud-noir";
            notes = "Notes: Aged Oud Wood, Smoky Incense, Patchouli.";
        }
        else if (season === 'winter' && startDay === 'cozy' && personality === 'warm') {
            title = "Vanilla Spiced Comfort";
            description = "Warm, inviting, and utterly cozy. This sweet, gourmand scent is like a warm blanket on a cold day. Ideal for relaxation and comfort.";
            image = "https://muskalmahalpakistan.com/cdn/shop/files/Render_0036_WO.jpg?v=1759345102&width=1800";
            link = "https://example.com/vanilla-spice";
            notes = "Notes: Madagascar Vanilla, Cinnamon, Brown Sugar.";
        }
        else if (season === 'spring' && startDay === 'calm' && personality === 'cheerful') {
            title = "Radiant Blossom Dream";
            description = "Your cheerful and energetic spirit deserves a vibrant floral scent. Experience the bloom of spring all year round.";
            image = "https://muskalmahalpakistan.com/cdn/shop/files/Render_0021_Engraved.jpg?v=1759346385&width=720";
            link = "https://example.com/radiant-blossom";
            notes = "Notes: White Florals, Pink Pepper, Cashmere Wood.";
        }
        document.getElementById('result-description').textContent = description;
        document.getElementById('perfume-image').src = image;
        document.getElementById('perfume-image').alt = title;
        document.getElementById('perfume-title').textContent = title;
        document.getElementById('perfume-link').href = link;
        document.getElementById('perfume-notes').textContent = notes;

        updateProgress();
    }
    showQuestion(0);
});
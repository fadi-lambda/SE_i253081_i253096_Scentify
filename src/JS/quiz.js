// quiz.js — Fragrance Finder Quiz (AI-Powered)
// Sends quiz answers to the Flask recommendation API instead of using
// hardcoded lookup logic. Renders loading/error states while waiting.

document.addEventListener('DOMContentLoaded', () => {

  const TOTAL_STEPS = 5;
  let currentStep = 1;
  const answers = {};

  // Change this to your deployed API URL once hosted (Render/Railway/etc.)
  const API_URL = 'http://127.0.0.1:5000/recommend';

  const progressFill  = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const backBtn       = document.getElementById('backBtn');
  const retakeBtn     = document.getElementById('retakeBtn');
  const resultStep    = document.getElementById('stepResult');
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

  function normalizeRecommendationId(id) {
    return LEGACY_PRODUCT_IDS[id] || id || 'sultan-e-ameer';
  }

  function getRecommendationImage(product) {
    if (product && product.image) return product.image;
    const normalizedId = normalizeRecommendationId(product && product.id);
    return `../../Images/Products/${normalizedId}/1.webp`;
  }

  function updateProgress() {
    const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;
    if (progressFill)  progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = `Question ${currentStep} of ${TOTAL_STEPS}`;
    if (backBtn) backBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  }

  function showStep(n) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(n <= TOTAL_STEPS ? `step${n}` : 'stepResult');
    if (target) target.classList.add('active');
    currentStep = n;
    updateProgress();
  }

  // --- Loading state ---
  function renderLoading() {
    if (!resultStep) return;
    resultStep.innerHTML = `
      <div class="quiz-result-card">
        <div class="quiz-loading">
          <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
          <p>Finding your perfect scent...</p>
        </div>
      </div>
    `;
  }

  // --- Error state ---
  function renderError() {
    if (!resultStep) return;
    resultStep.innerHTML = `
      <div class="quiz-result-card">
        <div class="quiz-error">
          <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
          <h2>Something went wrong</h2>
          <p>We couldn't reach our recommendation engine. Please check your connection and try again.</p>
          <button class="quiz-retake-btn" id="retryBtn">
            <i class="fas fa-redo" aria-hidden="true"></i> Try Again
          </button>
        </div>
      </div>
    `;
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) retryBtn.addEventListener('click', fetchRecommendations);
  }

  // --- Success state: render ranked recommendations ---
  function renderResults(recommendations) {
    if (!resultStep) return;

    if (!recommendations || recommendations.length === 0) {
      resultStep.innerHTML = `
        <div class="quiz-result-card">
          <div class="quiz-error">
            <i class="fas fa-search" aria-hidden="true"></i>
            <h2>No Matches Found</h2>
            <p>Try adjusting your preferences and take the quiz again.</p>
            <button class="quiz-retake-btn" id="retakeBtn2">
              <i class="fas fa-redo" aria-hidden="true"></i> Retake Quiz
            </button>
          </div>
        </div>
      `;
      const retake2 = document.getElementById('retakeBtn2');
      if (retake2) retake2.addEventListener('click', resetQuiz);
      return;
    }

    const topPick = recommendations[0];
    const otherPicks = recommendations.slice(1);
    const topPickId = normalizeRecommendationId(topPick.id);
    const topPickImage = getRecommendationImage(topPick);

    resultStep.innerHTML = `
      <div class="quiz-result-card">
        <div class="quiz-result-icon"><i class="fas fa-check-circle" aria-hidden="true"></i></div>
        <h2 class="quiz-result-title">Your Perfect Match</h2>
        <p class="quiz-result-subtitle">Based on your answers, we recommend:</p>

        <a href="product-detail.html?id=${topPickId}" class="quiz-result-product">
          <img src="${topPickImage}" alt="${topPick.name}" class="quiz-result-product-img">
          <div class="quiz-result-product-info">
            <h3>${topPick.name}</h3>
            <p class="quiz-result-price">Rs. ${topPick.price.toLocaleString()}</p>
            <span class="btn-primary">View Product</span>
          </div>
        </a>

        ${otherPicks.length > 0 ? `
          <p class="quiz-also-consider">Also worth considering:</p>
          <div class="quiz-other-picks">
            ${otherPicks.map(p => `
              <a href="product-detail.html?id=${normalizeRecommendationId(p.id)}" class="quiz-other-pick-card">
                <img src="${getRecommendationImage(p)}" alt="${p.name}" class="quiz-other-pick-img">
                <span class="quiz-other-pick-name">${p.name}</span>
                <span class="quiz-other-pick-price">Rs. ${p.price.toLocaleString()}</span>
              </a>
            `).join('')}
          </div>
        ` : ''}

        <button class="quiz-retake-btn" id="retakeBtn2">
          <i class="fas fa-redo" aria-hidden="true"></i> Retake Quiz
        </button>
      </div>
    `;

    const retake2 = document.getElementById('retakeBtn2');
    if (retake2) retake2.addEventListener('click', resetQuiz);
  }

  // --- Map internal answer keys to the API's expected payload shape ---
  function buildPayload() {
    return {
      gender: answers[1] || 'unisex',
      scent: answers[2] || 'woody',
      occasion: answers[3] || 'daily',
      intensity: answers[4] || '4-6',
      budget: answers[5] || '1000-2000'
    };
  }

  // --- Call the Flask API ---
  async function fetchRecommendations() {
    renderLoading();
    if (progressFill)  progressFill.style.width = '100%';
    if (progressLabel) progressLabel.textContent = 'Analysing your answers...';
    if (backBtn) backBtn.style.display = 'none';

    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    if (resultStep) resultStep.classList.add('active');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      if (progressLabel) progressLabel.textContent = 'Here\'s what we found!';
      renderResults(data.recommendations);

    } catch (err) {
      console.error('Recommendation API error:', err);
      renderError();
    }
  }

  function resetQuiz() {
    Object.keys(answers).forEach(k => delete answers[k]);
    document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));

    // Rebuild the result step back to its original placeholder markup
    // (it gets overwritten by loading/error/results states)
    location.reload();
  }

  // --- Option click → record answer → auto-advance ---
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = parseInt(btn.dataset.q);
      const val = btn.dataset.value;

      document.querySelectorAll(`.quiz-option[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      answers[q] = val;

      setTimeout(() => {
        if (q < TOTAL_STEPS) {
          showStep(q + 1);
        } else {
          fetchRecommendations();
        }
      }, 300);
    });
  });

  // --- Back button ---
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) showStep(currentStep - 1);
    });
  }

  // --- Retake (original button, before results replace the DOM) ---
  if (retakeBtn) {
    retakeBtn.addEventListener('click', resetQuiz);
  }

  // Init
  showStep(1);
});
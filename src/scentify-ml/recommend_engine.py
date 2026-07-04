"""
recommend_engine.py — Scentify Fragrance Recommendation Engine

CONCEPT (explained simply):
----------------------------
We treat each product like a short "document" made of words describing it
(scent family, occasion, intensity, notes). We also treat the user's quiz
answers as a "search query" — also just a short string of words.

TF-IDF (Term Frequency - Inverse Document Frequency) converts each piece of
text into a vector of numbers. Words that are common across ALL products
(like "musk" if every product has it) get a LOWER weight, because they don't
help distinguish products. Words that are rare/distinctive get a HIGHER
weight, because they're more useful for telling products apart.

Cosine similarity then measures the ANGLE between two vectors — not their
raw distance. Two vectors pointing in a similar "direction" (i.e. using
similar important words) get a similarity score close to 1. Completely
different vectors get a score close to 0.

So: quiz answers -> vector. Each product -> vector. We compare the quiz
vector against every product vector, and rank products by similarity score.
"""

import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_products(path="products.json"):
    with open(path, "r") as f:
        return json.load(f)


def build_product_profile(product):
    """
    Turns one product's structured data into a single text string.
    This is the 'document' that TF-IDF will vectorize.
    """
    parts = []

    # Scent family is the strongest signal — repeat it to boost its weight
    parts.extend(product["scent_family"] * 2)

    # Occasion
    parts.extend(product["occasion"])

    # Intensity as a word, not a number (TF-IDF works on words)
    parts.append(f"intensity_{product['intensity']}")

    # Ideal for
    parts.append(product["ideal_for"])

    # Fragrance notes — lowercased, split into individual words
    notes_text = f"{product['notes']['top']} {product['notes']['middle']} {product['notes']['base']}"
    notes_words = notes_text.lower().replace(",", "").split()
    parts.extend(notes_words)

    return " ".join(parts)


def build_quiz_profile(answers):
    """
    Turns the user's quiz answers into the same style of text string,
    so it can be compared against product profiles using the same
    vector space.

    answers = {
        "gender": "male" | "female" | "unisex",
        "scent": "woody" | "floral" | "musky" | "citrus",
        "occasion": "daily" | "evening" | "special",
        "intensity": "2-4" | "4-6" | "8+",
        "budget": "under1000" | "1000-2000" | "2000+"
    }
    """
    parts = []

    # Repeat scent twice — same weighting boost as product profiles
    parts.extend([answers["scent"]] * 2)
    parts.append(answers["occasion"])
    parts.append(f"intensity_{answers['intensity']}")

    # Map gender answer to ideal_for vocabulary
    gender_map = {"male": "male", "female": "female", "unisex": "unisex"}
    parts.append(gender_map.get(answers["gender"], "unisex"))

    return " ".join(parts)


def filter_by_budget(products, budget, min_results=2):
    """
    Budget is a HARD filter, not a similarity factor — we don't want to
    recommend a Rs.2500 product to someone who said 'under 1000'.

    SOFT FALLBACK: if the strict range gives us fewer than `min_results`
    products, we widen the range by 30% on both sides. This avoids
    showing weak/irrelevant matches just because a strict price cutoff
    left almost nothing to choose from.
    """
    budget_ranges = {
        "under1000": (0, 1000),
        "1000-2000": (1000, 2000),
        "2000+": (2000, 999999)
    }
    low, high = budget_ranges.get(budget, (0, 999999))

    def in_range(price, lo, hi):
        return lo <= price <= hi

    strict_matches = {
        pid: p for pid, p in products.items()
        if in_range(p["price"], low, high)
    }

    if len(strict_matches) >= min_results:
        return strict_matches

    # Widen the range by 30% on both sides
    widened_low = low * 0.7
    widened_high = high * 1.3 if high != 999999 else high

    widened_matches = {
        pid: p for pid, p in products.items()
        if in_range(p["price"], widened_low, widened_high)
    }

    return widened_matches if widened_matches else products


def recommend(answers, products, top_n=3, min_score_threshold=0.15):
    # Step 1: Hard-filter by budget first (with soft count-based fallback)
    filtered = filter_by_budget(products, answers["budget"])

    if not filtered:
        filtered = products

    def score_products(candidate_products):
        product_ids = list(candidate_products.keys())
        product_docs = [build_product_profile(candidate_products[pid]) for pid in product_ids]

        quiz_doc = build_quiz_profile(answers)
        all_docs = product_docs + [quiz_doc]

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(all_docs)

        quiz_vector = tfidf_matrix[-1]
        product_vectors = tfidf_matrix[:-1]

        similarities = cosine_similarity(quiz_vector, product_vectors).flatten()

        return sorted(
            zip(product_ids, similarities),
            key=lambda x: x[1],
            reverse=True
        )

    ranked = score_products(filtered)

    # SCORE-BASED WIDENING:
    # If even our best match is a weak similarity score (below threshold),
    # the budget filter is probably too narrow for this quiz combination.
    # Widen to the full catalog and re-score, so we don't hand back a
    # technically-in-budget but poorly-matching product.
    best_score = ranked[0][1] if ranked else 0
    if best_score < min_score_threshold and len(filtered) < len(products):
        filtered = products
        ranked = score_products(filtered)

    results = []
    for pid, score in ranked[:top_n]:
        results.append({
            "id": pid,
            "name": filtered[pid]["name"],
            "price": filtered[pid]["price"],
            "image": filtered[pid].get("image", ""),
            "score": round(float(score), 4)
        })

    return results


if __name__ == "__main__":
    products = load_products("products.json")

    # --- Test Case 1: Woody scent lover, evening wear, long-lasting, high budget ---
    test_answers_1 = {
        "gender": "male",
        "scent": "woody",
        "occasion": "evening",
        "intensity": "8+",
        "budget": "2000+"
    }

    print("=" * 60)
    print("TEST 1: Male, Woody, Evening, 8+ hrs, Rs.2000+")
    print("=" * 60)
    for r in recommend(test_answers_1, products):
        print(f"  {r['name']:<28} Rs.{r['price']:<6} score={r['score']}")

    # --- Test Case 2: Citrus lover, daily wear, budget-friendly ---
    test_answers_2 = {
        "gender": "male",
        "scent": "citrus",
        "occasion": "daily",
        "intensity": "4-6",
        "budget": "under1000"
    }

    print("\n" + "=" * 60)
    print("TEST 2: Male, Citrus, Daily, 4-6 hrs, Under Rs.1000")
    print("=" * 60)
    for r in recommend(test_answers_2, products):
        print(f"  {r['name']:<28} Rs.{r['price']:<6} score={r['score']}")

    # --- Test Case 3: Floral, unisex, special occasion ---
    test_answers_3 = {
        "gender": "unisex",
        "scent": "floral",
        "occasion": "special",
        "intensity": "8+",
        "budget": "1000-2000"
    }

    print("\n" + "=" * 60)
    print("TEST 3: Unisex, Floral, Special, 8+ hrs, Rs.1000-2000")
    print("=" * 60)
    for r in recommend(test_answers_3, products):
        print(f"  {r['name']:<28} Rs.{r['price']:<6} score={r['score']}")
export function parseExpenseText(text, members = [], currentUserId = "") {
  if (!text?.trim()) {
    return {};
  }

  const originalText = text.trim();
  const normalizedText = originalText.toLowerCase();

  const result = {
    description: originalText,
    amount: "",
    paidBy: "",
    category: "Other",
  };

  // =========================================
  // AMOUNT
  // =========================================

  const amount = extractAmount(normalizedText);

  if (amount !== null) {
    result.amount = String(amount);
  }

  // =========================================
  // PAID BY
  // =========================================

  const payer = findMember(normalizedText, members);

  if (payer) {
    result.paidBy = payer.id;
  } else if (/\b(i|me|my|myself|maine|main|मैंने|मैं|मैनें)\b/i.test(normalizedText)) {
    result.paidBy = currentUserId;
  }

  // =========================================
  // CATEGORY
  // =========================================

  result.category = detectCategory(normalizedText);

  return result;
}

// ===========================================
// AMOUNT
// ===========================================

function extractAmount(text) {
  const patterns = [
    // ₹5,000
    {
      regex: /₹\s*([\d,]+(?:\.\d+)?)/i,
      multiplier: 1,
    },

    // Rs 5000
    {
      regex: /rs\.?\s*([\d,]+(?:\.\d+)?)/i,
      multiplier: 1,
    },

    // INR 5000
    {
      regex: /inr\s*([\d,]+(?:\.\d+)?)/i,
      multiplier: 1,
    },

    // 5000 rupees
    {
      regex: /([\d,]+(?:\.\d+)?)\s*(?:rupees|rupee|rs)/i,
      multiplier: 1,
    },

    // 5000 rupya / rupaye
    {
      regex: /([\d,]+(?:\.\d+)?)\s*(?:rupya|rupaye|rupai|rupay)/i,
      multiplier: 1,
    },

    // 5000 रुपया / रुपये / रुपए
    {
      regex: /([\d,]+(?:\.\d+)?)\s*(?:रुपया|रुपये|रुपए|रुपए)/i,
      multiplier: 1,
    },

    // 2k
    {
      regex: /([\d,.]+)\s*k\b/i,
      multiplier: 1000,
    },

    // 2 thousand
    {
      regex: /([\d,.]+)\s*thousand\b/i,
      multiplier: 1000,
    },

    // 2 lakh
    {
      regex: /([\d,.]+)\s*lakh\b/i,
      multiplier: 100000,
    },

    // plain number
    {
      regex: /\b([\d,]+(?:\.\d+)?)\b/i,
      multiplier: 1,
    },
  ];

  for (const { regex, multiplier } of patterns) {
    const match = text.match(regex);

    if (match?.[1]) {
      const value = Number(match[1].replace(/,/g, "")) * multiplier;

      if (Number.isFinite(value) && value > 0) {
        return value;
      }
    }
  }

  return null;
}

// ===========================================
// FIND MEMBER
// ===========================================

function findMember(text, members) {
  if (!Array.isArray(members) || !members.length) {
    return null;
  }

  const sortedMembers = [...members].sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0));

  return (
    sortedMembers.find((member) => {
      const name = member.name?.trim().toLowerCase();

      if (!name) {
        return false;
      }

      return text.includes(name);
    }) || null
  );
}

// ===========================================
// CATEGORY
// ===========================================

function detectCategory(text) {
  const categories = {
    Food: [
      "food",
      "dinner",
      "lunch",
      "breakfast",
      "restaurant",
      "cafe",
      "coffee",
      "tea",
      "pizza",
      "burger",
      "meal",
      "bbq",
      "snacks",
      "snack",

      // Hindi / Hinglish
      "khana",
      "khane",
      "khaana",
      "nashta",
      "nasta",
      "chai",
      "चाय",
      "खाना",
      "खाने",
      "नाश्ता",
    ],

    Hotel: [
      "hotel",
      "room",
      "stay",
      "resort",
      "hostel",
      "airbnb",
      "lodging",

      // Hindi / Hinglish
      "kamra",
      "kamre",
      "कमरा",
      "कमरे",
    ],

    Transport: [
      "cab",
      "taxi",
      "uber",
      "ola",
      "auto",
      "rickshaw",
      "bus",
      "train",
      "metro",
      "flight",
      "petrol",
      "fuel",
      "parking",

      // Hindi / Hinglish
      "gadi",
      "gaadi",
      "ricksha",
      "safar",
      "गाड़ी",
      "सफर",
    ],

    Shopping: [
      "shopping",
      "clothes",
      "shirt",
      "shoes",
      "mall",
      "amazon",
      "flipkart",
      "purchase",
      "bought",

      // Hindi / Hinglish
      "kapde",
      "kapda",
      "khareeda",
      "kharida",
      "shopping",
      "कपड़े",
      "कपड़ा",
      "खरीदा",
      "खरीदा",
      "खरीदारी",
    ],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return "Other";
}

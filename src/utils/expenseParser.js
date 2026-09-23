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
  } else if (/\b(i|me|my|myself|maine|main|मैंने|मैं)\b/i.test(normalizedText)) {
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
    /₹\s*([\d,]+(?:\.\d+)?)/i,

    // Rs 5000
    /rs\.?\s*([\d,]+(?:\.\d+)?)/i,

    // INR 5000
    /inr\s*([\d,]+(?:\.\d+)?)/i,

    // 5000 rupees
    /([\d,]+(?:\.\d+)?)\s*(?:rupees|rs)/i,

    // plain number
    /\b([\d,]+(?:\.\d+)?)\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      const value = Number(match[1].replace(/,/g, ""));

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
    ],

    Hotel: ["hotel", "room", "stay", "resort", "hostel", "airbnb", "lodging"],

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
    ],

    Shopping: ["shopping", "clothes", "shirt", "shoes", "mall", "amazon", "flipkart", "purchase", "bought"],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return "Other";
}

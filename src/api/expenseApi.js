import { apiRequest } from "./apiClient";

export const createExpense = (groupId, expenseData) => {
  return apiRequest(`/expenses/groups/${groupId}`, {
    method: "POST",
    body: JSON.stringify(expenseData),
  });
};

export const getGroupExpenses = (groupId) => {
  return apiRequest(`/expenses/groups/${groupId}`);
};

export const getExpense = (expenseId) => {
  return apiRequest(`/expenses/${expenseId}`);
};

export const updateExpense = (expenseId, expenseData) => {
  return apiRequest(`/expenses/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify(expenseData),
  });
};

// =========================================
// DELETE EXPENSE
// =========================================

export const deleteExpense = (expenseId) => {
  return apiRequest(`/expenses/${expenseId}`, {
    method: "DELETE",
  });
};


export const getMyBalance = () => {
  return apiRequest("/expenses/balance/me");
};
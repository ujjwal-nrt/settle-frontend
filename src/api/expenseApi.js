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

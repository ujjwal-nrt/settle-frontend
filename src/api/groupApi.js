import { apiRequest } from "./apiClient";

export const getGroups = () => {
  return apiRequest("/groups");
};

export const getGroup = (groupId) => {
  return apiRequest(`/groups/${groupId}`);
};

export const createGroup = (groupData) => {
  return apiRequest("/groups", {
    method: "POST",
    body: JSON.stringify(groupData),
  });
};

export const addGroupPerson = (groupId, data) => {
  return apiRequest(`/groups/${groupId}/people`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const checkPhone = (phone) => {
  return apiRequest("/users/check-phone", {
    method: "POST",
    body: JSON.stringify({
      phone,
    }),
  });
};

export const leaveGroup = (groupId) =>
  apiRequest(`/groups/${groupId}/leave`, {
    method: "POST",
  });

// =========================================
// REMOVE MEMBER
// =========================================

export const removeGroupMember = (groupId, userId) =>
  apiRequest(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });

export const updateGroup = (groupId, groupData) =>
  apiRequest(`/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(groupData),
  });

// =========================================
// DELETE GROUP
// =========================================

export const deleteGroup = (groupId) =>
  apiRequest(`/groups/${groupId}`, {
    method: "DELETE",
  });

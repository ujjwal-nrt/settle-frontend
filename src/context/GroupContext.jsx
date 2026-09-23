import { createContext, useContext } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getGroups, createGroup } from "../api/groupApi";
import { useAuth } from "../hooks/useAuth";

const GroupContext = createContext(null);

export function GroupProvider({ children }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // =========================================
  // GET GROUPS
  // =========================================

  const {
    data: groupsData,
    isLoading: groupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    enabled: isAuthenticated,
  });

  const groups = groupsData?.groups || []; 
  // =========================================
  // CREATE GROUP
  // =========================================

  const createGroupMutation = useMutation({
    mutationFn: createGroup,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });

  const addGroup = async (group) => {
    return createGroupMutation.mutateAsync(group);
  };

  // =========================================
  // CONTEXT
  // =========================================

  return (
    <GroupContext.Provider
      value={{
        groups,

        groupsLoading,
        groupsError,

        addGroup,

        createGroupLoading: createGroupMutation.isPending,
        createGroupError: createGroupMutation.error,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export const useGroups = () => useContext(GroupContext);

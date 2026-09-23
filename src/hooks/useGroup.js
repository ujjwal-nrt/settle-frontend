import { useQuery } from "@tanstack/react-query";
import { getGroup } from "../api/groupApi";

export default function useGroup(groupId) {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroup(groupId),
    enabled: Boolean(groupId),

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
 
import { useGroups as useGroupContext } from "../context/GroupContext";

export default function useGroups() {
  return useGroupContext();
}

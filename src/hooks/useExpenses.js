import { useGroups } from '../context/GroupContext';
export default function useExpenses(groupId){const {getGroup}=useGroups();return getGroup(groupId)?.expenses||[]}

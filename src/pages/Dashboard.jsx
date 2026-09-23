import { useAuth } from "../hooks/useAuth";
import { useGroups } from "../context/GroupContext";

import BalanceCard from "../components/dashboard/BalanceCard";
import ExpenseActions from "../components/dashboard/ExpenseActions";
import RecentGroups from "../components/dashboard/RecentGroups";
import RecentActivity from "../components/dashboard/RecentActivity";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();

  const isLoading = authLoading || groupsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const time = new Date().getHours();

  const greetings = time < 12 ? "Good morning" : time < 15 ? "Good afternoon" : "Good evening";

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Dashboard</span>

          <h1>
            {greetings}, {user?.name}
          </h1>

          <p>Here’s what’s happening with your shared expenses.</p>
        </div>
      </div>

      <BalanceCard groups={groups || []} currentUserId={user?.id} />

      <ExpenseActions />

      <RecentGroups />

      <RecentActivity />
    </div>
  );
}

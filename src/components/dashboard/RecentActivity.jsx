import Avatar from "../common/Avatar";
import { formatCurrency } from "../../utils/currency";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllActivity, getRecentActivity } from "../../api/groupApi";

export default function RecentActivity({ showHeader = true }) {
  const isDashboard = showHeader;

  const { data, isLoading, isError } = useQuery({
    queryKey: isDashboard ? ["recentActivity"] : ["activity"],

    queryFn: isDashboard ? getRecentActivity : getAllActivity,

    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const activities = data?.activities || [];

  if (isLoading) {
    return (
      <section>
        {showHeader && (
          <div className="section-title">
            <h2>Recent Activity</h2>
          </div>
        )}

        <div className="list-card">
          <div className="empty-state">Loading activity...</div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        {showHeader && (
          <div className="section-title">
            <h2>Recent Activity</h2>
          </div>
        )}

        <div className="list-card">
          <div className="empty-state">Unable to load activity.</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      {showHeader && (
        <div className="section-title">
          <h2>Recent Activity</h2>

          <Link to="/app/activity">See all</Link>
        </div>
      )}

      <div className="list-card recent-activity">
        {activities.length === 0 ? (
          <div className="empty-state">
            <p>No recent activity.</p>
          </div>
        ) : (
          activities.map((expense) => {
            const paidBy = expense.users || null;

            const expenseDate = expense.created_at
              ? new Date(expense.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "";

            return (
              <div className="activity-row" key={expense.id}>
                <Avatar src={paidBy?.avatar} name={paidBy?.name || "User"} />

                <div className="row-main">
                  <b className={showHeader ? "hidden-title" : ""}>{expense.title}</b>

                  <span>
                    {expense.groups?.name || "Unknown group"}

                    {expenseDate ? ` · ${expenseDate}` : ""}
                  </span>
                </div>

                <strong>{formatCurrency(Number(expense.amount || 0))}</strong>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

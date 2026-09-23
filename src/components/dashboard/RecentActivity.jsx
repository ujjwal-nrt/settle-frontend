import Avatar from "../common/Avatar";
import { formatCurrency } from "../../utils/currency";
import { useGroups } from "../../context/GroupContext";

export default function RecentActivity() {
  const { groups, groupsLoading } = useGroups();

  const all = groups
    .flatMap((group) =>
      (group.expenses || []).map((expense) => ({
        ...expense,
        group,
      })),
    )
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5);

  if (groupsLoading) {
    return (
      <section>
        <div className="section-title">
          <h2>Recent activity</h2>
        </div>

        <div className="list-card">
          <div className="empty-state">Loading activity...</div>
        </div>
      </section>
    );
  }

  return (
    <section>
        {/* <div className="section-title">
          <h2>Recent activity</h2>
        </div> */}

      <div className="list-card">
        {all.length === 0 ? (
          <div className="empty-state">
            <p>No recent activity.</p>
          </div>
        ) : (
          all.map((expense) => {
            const members = expense.group.members || [];

            const paidBy = members.find((member) => member.id === expense.paid_by) || null;

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
                  <b>{expense.title}</b>

                  <span>
                    {expense.group.name}
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

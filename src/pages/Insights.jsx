import { Link, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";

import { useGroups } from "../context/GroupContext";
import { formatCurrency } from "../utils/currency";

export default function Insights() {
  const { groupId } = useParams();

  const { groups, groupsLoading, groupsError } = useGroups();

  // =========================================
  // LOADING
  // =========================================

  if (groupsLoading) {
    return <div className="empty-state">Loading insights...</div>;
  }

  // =========================================
  // ERROR
  // =========================================

  if (groupsError) {
    return <div className="empty-state">Failed to load group.</div>;
  }

  // =========================================
  // FIND GROUP
  // =========================================

  const group = groups.find((item) => String(item.id) === String(groupId));

  if (!group) {
    return <div className="empty-state">Group not found.</div>;
  }

  // =========================================
  // EXPENSES
  // =========================================

  const expenses = Array.isArray(group.expenses) ? group.expenses : [];

  // =========================================
  // TOTAL
  // =========================================

  const total = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);

  // =========================================
  // CATEGORY BREAKDOWN
  // =========================================

  const byCategory = {};

  expenses.forEach((expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    byCategory[category] = (byCategory[category] || 0) + amount;
  });

  // =========================================
  // CATEGORY LIST
  // =========================================

  const categories = Object.entries(byCategory).sort(([, amountA], [, amountB]) => amountB - amountA);

  return (
    <div className="narrow-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="back-row">
        <Link to={`/app/groups/${group.id}`}>
          <ArrowLeft size={20} />
        </Link>

        <div>
          <span className="eyebrow">{group.name}</span>

          <h1>Group insights</h1>
        </div>
      </div>

      {/* =====================================
          TOTAL SPENT
      ===================================== */}

      <div className="insight-total">
        <TrendingUp size={22} />

        <span>Total spent</span>

        <strong>{formatCurrency(total)}</strong>

        <small>
          Across {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
        </small>
      </div>

      {/* =====================================
          CATEGORY BREAKDOWN
      ===================================== */}

      {categories.length === 0 ? (
        <div className="empty-state">No expenses yet.</div>
      ) : (
        <div className="list-card">
          {categories.map(([category, amount]) => {
            const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;

            return (
              <div className="balance-row" key={category}>
                <span>{category}</span>

                <b>
                  {formatCurrency(amount)}
                  {" · "}
                  {percentage}%
                </b>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

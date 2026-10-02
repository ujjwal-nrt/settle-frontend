import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import useGroup from "../hooks/useGroup";
import ExpenseForm from "../components/expense/ExpenseForm";

export default function EditExpense() {
  const { groupId, expenseId } = useParams();

  const { data, isLoading, error } = useGroup(groupId);

  const group = data?.group;

  if (isLoading) {
    return <div className="empty-state">Loading expense...</div>;
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Unable to load expense</h3>
        <p>{error.message || "Something went wrong."}</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="empty-state">
        <h3>Group not found</h3>

        <Link to="/app/groups">← Back to groups</Link>
      </div>
    );
  }

  const expense = group.expenses?.find((item) => String(item.id) === String(expenseId));

  if (!expense) {
    return (
      <div className="empty-state">
        <h3>Expense not found</h3>

        <Link to={`/app/groups/${group.id}`}>← Back to group</Link>
      </div>
    );
  }

  return (
    <div className="narrow-page">
      {/* HEADER */}

      <div className="back-row expense-detail-header">
        <Link to={`/app/groups/${group.id}/expense/${expense.id}`}>
          <ArrowLeft size={21} />
        </Link>

        <div className="expense-detail-title">
          <span className="eyebrow">Edit expense</span>

          <h1>{expense.title}</h1>
        </div>
      </div>

      {/* FORM */}

      <ExpenseForm group={group} initialExpense={expense} mode="edit" />
    </div>
  );
}

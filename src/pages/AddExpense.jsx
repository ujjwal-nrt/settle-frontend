import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ExpenseForm from "../components/expense/ExpenseForm";
import useGroup from "../hooks/useGroup";

export default function AddExpense() {
  const { groupId } = useParams();

  const { data, isLoading, error } = useGroup(groupId);

  const group = data?.group;

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Loading group...</h3>
        <p>Please wait while we load the group.</p>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="empty-state">
        <h3>Unable to load group</h3>

        <p>{error.message || "Something went wrong."}</p>

        <Link to="/app/groups">← Back to groups</Link>
      </div>
    );
  }

  // =========================================
  // NOT FOUND
  // =========================================

  if (!group) {
    return (
      <div className="empty-state">
        <h3>Group not found</h3>

        <p>This group may have been deleted or you don't have access to it.</p>

        <Link to="/app/groups">← Back to groups</Link>
      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="add-expense-page">
      <div className="add-expense-header">
        <Link to={`/app/groups/${group.id}`}>
          <ArrowLeft size={20} />
        </Link>

        <h1>Add Expense</h1>

        <div />
      </div>

      <ExpenseForm group={group} />
    </div>
  );
}

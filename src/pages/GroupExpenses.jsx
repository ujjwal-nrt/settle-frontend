import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

import useGroup from "../hooks/useGroup";
import Button from "../components/common/Button";

export default function GroupExpenses() {
  const { groupId } = useParams();

  const { data, isLoading, error } = useGroup(groupId);

  const group = data?.group;
  const navigate = useNavigate();

  // ==============================
  // LOADING
  // ==============================

  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Loading expenses...</h3>
        <p>Please wait while we load the expenses.</p>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <div className="empty-state">
        <h3>Unable to load expenses</h3>

        <p>{error.message || "Something went wrong while loading expenses."}</p>

        <Link to={`/app/groups/${groupId}`}>← Back to group</Link>
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

  const expenses = group.expenses || [];

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="group-details-page">
      {/* HEADER */}

      <div className="group-details-header">
        <Link to={`/app/groups/${group.id}`}>
          <ArrowLeft size={20} />
        </Link>

        <div className="group-title">
          <div className="group-title-icon">{group.emoji || "👥"}</div>

          <div>
            <h1>{group.name}</h1>

            <span>
              {expenses.length} expense
              {expenses.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div />
      </div>

      {/* TABS */}

      <div className="group-tabs">
        <Link to={`/app/groups/${group.id}`}>Overview</Link>

        <Link to={`/app/groups/${group.id}/expenses`} className="active">
          Expenses
        </Link>

        <Link to={`/app/groups/${group.id}/members`}>Members</Link>
      </div>

      {/* EXPENSES */}

      <div className="recent-expenses">
        <div className="section-heading">
          <h2>All expenses</h2>

          <Link to={`/app/groups/${group.id}/expense/add`} className="add-expense-small">
            <Plus size={16} />
            Add
          </Link>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses yet.</p>

            <Button onClick={() => navigate(`/app/groups/${group.id}/expense/add`)}>Add your first expense</Button>
          </div>
        ) : (
          expenses.map((expense) => (
            <Link key={expense.id} to={`/app/groups/${group.id}/expense/${expense.id}`} className="expense-row">
              <div className="expense-row-left">
                <div className="expense-icon">
                  {expense.category === "Hotel"
                    ? "🏨"
                    : expense.category === "Food"
                      ? "🍴"
                      : expense.category === "Transport"
                        ? "🚕"
                        : "₹"}
                </div>

                <div>
                  <strong>{expense.title}</strong>

                  <span>{formatDate(expense.created_at || expense.date)}</span>
                </div>
              </div>

              <strong>{formatCurrency(expense.amount)}</strong>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

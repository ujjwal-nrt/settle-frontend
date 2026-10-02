import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Search, SlidersHorizontal } from "lucide-react";

import useGroup from "../hooks/useGroup";
import Button from "../components/common/Button";
import { useMemo, useState } from "react";

export default function GroupExpenses() {
  const { groupId } = useParams();

  const { data, isLoading, error } = useGroup(groupId);

  const group = data?.group;
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const expenses = group?.expenses || [];

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // -----------------------------
    // CATEGORY
    // -----------------------------

    if (categoryFilter !== "All") {
      result = result.filter((expense) => expense.category === categoryFilter);
    }

    // -----------------------------
    // SEARCH
    // -----------------------------

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((expense) =>
        [expense.title, expense.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchValue)),
      );
    }

    // -----------------------------
    // SORT
    // -----------------------------

    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    if (sortBy === "highest") {
      result.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
    }

    if (sortBy === "lowest") {
      result.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
    }

    return result;
  }, [expenses, categoryFilter, search, sortBy]);

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

        <div className="expense-filter-bar">
          <div className="expense-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="expense-filter-row">
            <div className="category-filters">
              {["All", "Food", "Transport", "Hotel", "Other"].map((category) => (
                <button
                  key={category}
                  type="button"
                  className={categoryFilter === category ? "active" : ""}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="expense-sort">
              <SlidersHorizontal size={16} />

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="latest">Latest</option>

                <option value="oldest">Oldest</option>

                <option value="highest">Highest amount</option>

                <option value="lowest">Lowest amount</option>
              </select>
            </div>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses yet.</p>

            <Button onClick={() => navigate(`/app/groups/${group.id}/expense/add`)}>Add your first expense</Button>
          </div>
        ) : (
          // expenses.map((expense) => (
          filteredExpenses.map((expense) => (
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

import { Link, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, ShoppingBag, Car, Utensils, MoreHorizontal, ChevronRight } from "lucide-react";

import useGroup from "../hooks/useGroup";
import { formatCurrency } from "../utils/currency";

const getCategoryIcon = (category) => {
  const value = category.toLowerCase();

  if (value.includes("shop")) return ShoppingBag;
  if (value.includes("transport") || value.includes("travel")) return Car;
  if (value.includes("food") || value.includes("meal")) return Utensils;

  return MoreHorizontal;
};

export default function Insights() {
  const { groupId } = useParams();

  const { data, isLoading: groupLoading, isError: groupError, error } = useGroup(groupId);

  const group = data?.group || data;

  // =========================================
  // LOADING
  // =========================================

  if (groupLoading) {
    return (
      <div className="insights-page">
        <div className="empty-state">
          <h3>Loading insights...</h3>
          <p>Please wait while we analyze your expenses.</p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (groupError) {
    return (
      <div className="insights-page">
        <div className="empty-state">
          <h3>Failed to load insights.</h3>
          <p>{error?.message || "Something went wrong while loading the group."}</p>
        </div>
      </div>
    );
  }

  // =========================================
  // GROUP NOT FOUND
  // =========================================

  if (!group) {
    return (
      <div className="insights-page">
        <div className="empty-state">
          <h3>Group not found.</h3>

          <Link to="/app/groups">← Back to groups</Link>
        </div>
      </div>
    );
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

  const categories = Object.entries(byCategory).sort(([, amountA], [, amountB]) => amountB - amountA);

  const topCategory = categories[0];

  return (
    <div className="insights-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="insights-header">
        <Link to={`/app/groups/${group.id}`} className="insights-back">
          <ArrowLeft size={19} />
        </Link>

        <div>
          <span className="insights-eyebrow">{group.name}</span>

          <h1>Group insights</h1>
        </div>
      </div>

      {/* =====================================
          TOTAL SPENT CARD
      ===================================== */}

      <section className="insights-total-card">
        <div className="insights-total-top">
          <div className="insights-total-icon">
            <TrendingUp size={21} />
          </div>

          <span>Total spent</span>
        </div>

        <strong className="insights-total-amount">{formatCurrency(total)}</strong>

        <div className="insights-total-meta">
          <span>
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
          </span>

          <span className="insights-meta-dot">•</span>

          <span>
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </span>
        </div>
      </section>

      {/* =====================================
          TOP SPENDING
      ===================================== */}

      {topCategory && total > 0 && (
        <section className="insights-highlight">
          <div className="insights-highlight-icon">
            <TrendingUp size={18} />
          </div>

          <div className="insights-highlight-content">
            <span>Highest spending</span>

            <strong>{topCategory[0]}</strong>
          </div>

          <div className="insights-highlight-value">
            <strong>{formatCurrency(topCategory[1])}</strong>

            <span>{Math.round((topCategory[1] / total) * 100)}%</span>
          </div>
        </section>
      )}

      {/* =====================================
          CATEGORY BREAKDOWN
      ===================================== */}

      <section className="insights-category-section">
        <div className="insights-section-heading">
          <div>
            <span>Spending</span>
            <h2>By category</h2>
          </div>

          <span className="insights-category-count">{categories.length}</span>
        </div>

        {categories.length === 0 ? (
          <div className="insights-empty">
            <TrendingUp size={24} />

            <h3>No expenses yet</h3>

            <p>Add an expense to start seeing your spending insights.</p>
          </div>
        ) : (
          <div className="insights-category-list">
            {categories.map(([category, amount]) => {
              const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;

              const Icon = getCategoryIcon(category);

              return (
                <div className="insights-category-card" key={category}>
                  <div className="insights-category-main">
                    <div className="insights-category-icon">
                      <Icon size={18} />
                    </div>

                    <div className="insights-category-info">
                      <div className="insights-category-title">
                        <strong>{category}</strong>

                        <span>{percentage}%</span>
                      </div>

                      <div className="insights-progress">
                        <div
                          className="insights-progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="insights-category-amount">
                    <strong>{formatCurrency(amount)}</strong>

                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

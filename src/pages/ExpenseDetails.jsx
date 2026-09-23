import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, UserRound, Users } from "lucide-react";

import Avatar from "../components/common/Avatar";
import { formatCurrency } from "../utils/currency";
import useGroup from "../hooks/useGroup";

export default function ExpenseDetails() {
  const { groupId, expenseId } = useParams();

  const { data, isLoading, error } = useGroup(groupId);

  const group = data?.group;

  if (isLoading) {
    return <div className="empty-state">Loading expense...</div>;
  }

  if (error) {
    return <div className="empty-state">Failed to load group.</div>;
  }

  if (!group) {
    return <div className="empty-state">Group not found.</div>;
  }

  const expense = group.expenses?.find((item) => String(item.id) === String(expenseId));
 

  if (!expense) {
    return <div className="empty-state">Expense not found.</div>;
  }

  const members = group.members || [];

  // =========================================
  // PAYER
  // =========================================

  const payer = members.find((member) => String(member.id) === String(expense.paid_by));

  // =========================================
  // PARTICIPANTS + SHARES
  // =========================================

  const participants = Array.isArray(expense.expense_participants)
    ? expense.expense_participants
        .map((participant) => {
          const member = members.find((item) => String(item.id) === String(participant.user_id));

          if (!member) {
            return null;
          }

          return {
            ...member,
            amount: Number(participant.share || 0),
          };
        })
        .filter(Boolean)
    : [];

  return (
    <div className="narrow-page">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="back-row">
        <Link to={`/app/groups/${group.id}`}>
          <ArrowLeft size={21} />
        </Link>

        <div>
          <span className="eyebrow">Expense details</span>

          <h1>{expense.title}</h1>
        </div>
      </div>

      {/* =========================================
          EXPENSE SUMMARY
      ========================================= */}

      <div className="detail-card">
        <div className="detail-amount">
          <strong>{formatCurrency(expense.amount)}</strong>

          {expense.category && <span>{expense.category}</span>}
        </div>

        {/* =======================================
            PAID BY
        ======================================= */}

        <div className="detail-item">
          <UserRound size={20} />

          <div>
            <span>Paid by</span>

            <b>{payer?.name || "Unknown member"}</b>
          </div>
        </div>

        {/* =======================================
            DATE
        ======================================= */}

        <div className="detail-item">
          <Calendar size={20} />

          <div>
            <span>Date</span>

            <b>
              {expense.created_at
                ? new Date(expense.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "No date"}
            </b>
          </div>
        </div>

        {/* =======================================
            SPLIT TYPE
        ======================================= */}

        <div className="detail-item">
          <Users size={20} />

          <div>
            <span>Split</span>

            <b>{expense.split_type || "equal"}</b>
          </div>
        </div>

        {/* =======================================
            SHARES
        ======================================= */}

        <div className="shares-section">
          <h3>Shares</h3>

          {participants.length === 0 ? (
            <div className="empty-state">No participants found.</div>
          ) : (
            <div className="shares-list">
              {participants.map((participant) => (
                <div className="share-row" key={participant.id}>
                  <div className="share-member">
                    <Avatar src={participant.avatar} name={participant.name} size="sm" />
                    <span>{participant.name}</span>
                  </div>

                  <strong>{formatCurrency(participant.amount)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

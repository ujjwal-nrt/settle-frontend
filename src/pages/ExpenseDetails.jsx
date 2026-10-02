import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Pencil, Trash2, UserRound, Users } from "lucide-react";

import Avatar from "../components/common/Avatar";
import { formatCurrency } from "../utils/currency";
import useGroup from "../hooks/useGroup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Toast from "../components/common/Toast";
import Modal from "../components/common/Modal";
import { deleteExpense } from "../api/expenseApi";

export default function ExpenseDetails() {
  const { groupId, expenseId } = useParams();

  const { data, isLoading, error } = useGroup(groupId);

  const navigate = useNavigate();

  const group = data?.group;

  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const savedToast = sessionStorage.getItem("expense_updated_toast");

    if (!savedToast) {
      return;
    }

    try {
      const parsedToast = JSON.parse(savedToast);

      setToast({
        show: true,
        type: parsedToast.type || "success",
        message: parsedToast.message || "",
      });

      // Remove stored toast so it won't appear again
      sessionStorage.removeItem("expense_updated_toast");

      // Hide toast after 3.5 seconds
      const timer = setTimeout(() => {
        setToast((current) => ({
          ...current,
          show: false,
        }));
      }, 3500);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("TOAST PARSE ERROR:", error);
      sessionStorage.removeItem("expense_updated_toast");
    }
  }, []);

  // =========================================
  // DELETE EXPENSE
  // =========================================

  const deleteMutation = useMutation({
    mutationFn: () => deleteExpense(expenseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      setToast({
        show: true,
        type: "success",
        message: "Expense deleted successfully",
      });

      setTimeout(() => {
        navigate(`/app/groups/${groupId}`);
      }, 700);
    },

    onError: (error) => {
      setToast({
        show: true,
        type: "error",
        message: error.message || "Unable to delete expense",
      });
    },
  });

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return <div className="empty-state">Loading expense...</div>;
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return <div className="empty-state">Failed to load group.</div>;
  }

  // =========================================
  // GROUP NOT FOUND
  // =========================================

  if (!group) {
    return <div className="empty-state">Group not found.</div>;
  }

  // =========================================
  // FIND EXPENSE
  // =========================================

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

      <div className="back-row expense-detail-header">
        <Link to={`/app/groups/${group.id}`}>
          <ArrowLeft size={21} />
        </Link>

        <div className="expense-detail-title">
          <span className="eyebrow">Expense details</span>

          <h1>{expense.title}</h1>
        </div>

        <div className="expense-actions">
          <button
            type="button"
            className="expense-action-button"
            onClick={() => navigate(`/app/groups/${group.id}/expense/${expense.id}/edit`)}
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            className="expense-action-button expense-delete-button"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} />
            Delete
          </button>
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
            LAST EDITED
        ======================================= */}

        {expense.updated_by && expense.updated_at && (
          <div className="detail-item expense-edited-by">
            <Avatar src={expense.editor?.avatar} name={expense.editor?.name} size="sm" />

            <div>
              <span>Last edited by</span>

              <b>{expense.editor?.name || "Unknown member"}</b>

              <small>
                {new Date(expense.updated_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </small>
            </div>
          </div>
        )}

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

      {/* =========================================
          DELETE MODAL
      ========================================= */}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setShowDeleteModal(false);
          }
        }}
        title="Delete expense?"
        confirmText="Delete expense"
        cancelText="Cancel"
        onConfirm={() => deleteMutation.mutate()}
        confirmLoading={deleteMutation.isPending}
      >
        <div className="action-modal-content">
          <div className="action-modal-icon danger">
            <Trash2 size={22} />
          </div>

          <p>
            Are you sure you want to delete <strong>{expense.title}</strong>?
          </p>

          <span className="action-modal-note">
            This will permanently remove this expense and its participant shares.
          </span>
        </div>
      </Modal>

      {/* =========================================
          TOAST
      ========================================= */}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((current) => ({
            ...current,
            show: false,
          }))
        }
      />
    </div>
  );
}

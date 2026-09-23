import { Link, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, LogOut, Plane, Plus, Settings2, Trash2, Loader2 } from "lucide-react";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useGroup from "../hooks/useGroup";

import { deleteGroup, leaveGroup } from "../api/groupApi";

import Modal from "../components/common/Modal";
import { useAuth } from "../hooks/useAuth";
import Toast from "../components/common/Toast";

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGroup(groupId);

  const group = data?.group;
  const { user } = useAuth();

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast((current) => ({
        ...current,
        show: false,
      }));
    }, 3000);
  };

  // =========================================
  // STATE
  // =========================================

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // =========================================
  // OWNER
  // =========================================

  const isOwner = String(group?.created_by) === String(user?.id);

  // =========================================
  // GROUP SETTINGS
  // =========================================

  const handleGroupSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    if (!deleting && !leaving) {
      setShowSettings(false);
    }
  };

  // =========================================
  // DELETE GROUP
  // =========================================

  const handleDeleteGroup = () => {
    setShowSettings(false);
    setShowDeleteModal(true);
  };

  const confirmDeleteGroup = async () => {
    if (!group) return;

    try {
      setDeleting(true);

      await queryClient.cancelQueries({
        queryKey: ["group", group.id],
      });

      await deleteGroup(group.id);
      showToast("Group deleted successfully");

      setShowDeleteModal(false);

      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      navigate("/app/groups", {
        replace: true,
      });
    } catch (error) {
      console.error("DELETE GROUP ERROR:", error);

      showToast(error.message || "Unable to delete the group.", "error");
    } finally {
      setDeleting(false);
    }
  };
  // =========================================
  // LEAVE GROUP
  // =========================================

  const handleLeaveGroup = () => {
    setShowSettings(false);
    setShowLeaveModal(true);
  };

  const confirmLeaveGroup = async () => {
    if (!group) return;

    try {
      setLeaving(true);

      await leaveGroup(group.id);
      showToast("You left the group");

      setShowLeaveModal(false);

      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      queryClient.removeQueries({
        queryKey: ["group", group.id],
      });

      navigate("/app/groups", {
        replace: true,
      });
    } catch (error) {
      console.error("LEAVE GROUP ERROR:", error);

      alert(error.message || "Unable to leave the group.");
    } finally {
      setLeaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Loading group...</h3>

        <p>Please wait while we load the group details.</p>
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

        <p>{error.message || "Something went wrong while loading the group."}</p>

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
  // TOTAL SPENT
  // =========================================

  const totalSpent = group.expenses?.reduce((total, expense) => total + Number(expense.amount || 0), 0) || 0;

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================================
  // FORMAT CURRENCY
  // =========================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="group-details-page">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="group-details-header">
        <Link to="/app/groups">
          <ArrowLeft size={20} />
        </Link>

        <div className="group-title">
          <div className="group-title-icon">{group.emoji || "👥"}</div>

          <div>
            <h1>{group.name}</h1>

            <span>{group.members?.length || 0} people</span>
          </div>
        </div>

        <button type="button" className="icon-button" aria-label="Group settings" onClick={handleGroupSettings}>
          <Settings2 size={18} />
        </button>
      </div>

      {/* =========================================
          TABS
      ========================================= */}

      <div className="group-tabs">
        <Link to={`/app/groups/${group.id}`} className="active">
          Overview
        </Link>

        <Link to={`/app/groups/${group.id}/expenses`}>Expenses</Link>

        <Link to={`/app/groups/${group.id}/members`}>Members</Link>
      </div>

      {/* =========================================
          GROUP SUMMARY
      ========================================= */}

      <div className="group-cover-card">
        <div className="group-cover-image">
          <img src={group?.cover_image || "/images/group-covers/default.jpg"} alt={group?.name || "Group"} />

          <div>
            <strong>Good people</strong>
            <span>Great memories</span>
            <span>Shared expenses</span>
          </div>
        </div>

        <div className="group-total">
          <span>Total spent</span>
          <strong>{formatCurrency(totalSpent)}</strong>
        </div>
      </div>

      {/* =========================================
          BALANCE
      ========================================= */}

      <div className="balance-grid">
        <div className="balance-box">
          <span>Your balance</span>

          <strong>+ ₹0</strong>
        </div>

        <div className="balance-box">
          <span>Group share</span>

          <strong>{formatCurrency(totalSpent)}</strong>
        </div>
      </div>

      {/* =========================================
          SETTLEMENT
      ========================================= */}

      <Link to={`/app/groups/${group.id}/settlement`} className="optimize-settlement">
        <div className="settlement-icon">
          <Plane size={20} />
        </div>

        <div>
          <strong>Optimize Settlement</strong>

          <span>Calculate your group payments</span>
        </div>

        <span>›</span>
      </Link>

      {/* =========================================
          RECENT EXPENSES
      ========================================= */}

      <div className="recent-expenses">
        <div className="section-heading">
          <h2>Recent expenses</h2>

          <Link to={`/app/groups/${group.id}/expenses`}>See all</Link>
        </div>

        {!group.expenses?.length ? (
          <div className="empty-state">
            <p>No expenses yet.</p>
          </div>
        ) : (
          group.expenses.slice(0, 5).map((expense) => (
            <Link to={`/app/groups/${group.id}/expense/${expense.id}`} className="expense-row" key={expense.id}>
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

                  <span>{formatDate(expense.created_at)}</span>
                </div>
              </div>

              <strong>{formatCurrency(expense.amount)}</strong>
            </Link>
          ))
        )}
      </div>

      {/* =========================================
          ADD EXPENSE
      ========================================= */}

      <Link to={`/app/groups/${group.id}/expense/add`} className="add-expense-button">
        <Plus size={18} />
        Add Expense
      </Link>

      {/* =========================================
          GROUP SETTINGS MODAL
      ========================================= */}

      <Modal isOpen={showSettings} onClose={closeSettings} title="Group settings" showFooter={false}>
        <div className="group-settings-menu">
          {/* EDIT GROUP */}

          {isOwner && (
            <button
              type="button"
              className="group-setting-item"
              onClick={() => {
                setShowSettings(false);

                navigate(
                  `/app/groups/${group.id}/edit`
                );
              }}
            >
              <Settings2 size={18} />

              <div>
                <strong>Edit group</strong>

                <span>Change group name, emoji or type</span>
              </div>
            </button>
          )}

          {/* LEAVE GROUP */}

          {!isOwner && (
            <button type="button" className="group-setting-item danger" onClick={handleLeaveGroup} disabled={leaving}>
              <LogOut size={18} />

              <div>
                <strong>Leave group</strong>

                <span>Remove yourself from this group</span>
              </div>
            </button>
          )}

          {/* DANGER ZONE */}

          {isOwner && (
            <div className="group-settings-danger">
              <span className="danger-label">Danger zone</span>

              <button
                type="button"
                className="group-setting-item danger"
                onClick={handleDeleteGroup}
                disabled={deleting}
              >
                <Trash2 size={18} />

                <div>
                  <strong>Delete group</strong>

                  <span>Permanently delete this group and its data</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* =========================================
          LEAVE GROUP CONFIRMATION
      ========================================= */}

      <Modal
        isOpen={showLeaveModal}
        onClose={() => {
          if (!leaving) {
            setShowLeaveModal(false);
          }
        }}
        title="Leave group"
        confirmText="Leave group"
        cancelText="Cancel"
        onConfirm={confirmLeaveGroup}
        confirmLoading={leaving}
      >
        <div className="action-modal-content">
          <div className="action-modal-icon danger">
            <LogOut size={22} />
          </div>

          <p>
            Are you sure you want to leave <strong>{group.name}</strong>?
          </p>

          <span className="action-modal-note">Your previous expenses will remain in the group history.</span>
        </div>
      </Modal>

      {/* =========================================
          DELETE GROUP CONFIRMATION
      ========================================= */}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!deleting) {
            setShowDeleteModal(false);
          }
        }}
        title="Delete group"
        confirmText="Delete group"
        cancelText="Cancel"
        onConfirm={confirmDeleteGroup}
        confirmLoading={deleting}
      >
        <div className="action-modal-content">
          <div className="action-modal-icon danger">
            <Trash2 size={22} />
          </div>

          <p>
            Are you sure you want to delete <strong>{group.name}</strong>?
          </p>

          <span className="action-modal-note">
            This will permanently delete the group, expenses, split details, memberships, and invitations. This action
            cannot be undone.
          </span>
        </div>
      </Modal>

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

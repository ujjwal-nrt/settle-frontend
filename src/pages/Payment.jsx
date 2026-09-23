import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, Lock, Smartphone } from "lucide-react";

import { useGroups } from "../context/GroupContext";
import { useAuth } from "../hooks/useAuth";

import { groupBalances } from "../utils/calculations";
import { optimizeSettlements } from "../utils/settlement";

export default function Payment() {
  const navigate = useNavigate();
  const { groupId, paymentId } = useParams();

  const { user } = useAuth();

  const { groups, groupsLoading, groupsError } = useGroups();

  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [selectedApp, setSelectedApp] = useState("phonepe");

  // =========================================
  // LOADING
  // =========================================

  if (groupsLoading) {
    return <div className="empty-state">Loading payment...</div>;
  }

  // =========================================
  // ERROR
  // =========================================

  if (groupsError) {
    return <div className="empty-state">Failed to load payment details.</div>;
  }

  // =========================================
  // FIND GROUP
  // =========================================

  const group = groups?.find((item) => String(item.id) === String(groupId));

  if (!group) {
    return (
      <div className="empty-state">
        <h3>Group not found</h3>

        <button type="button" onClick={() => navigate("/app/groups")}>
          Back to groups
        </button>
      </div>
    );
  }

  // =========================================
  // CALCULATE CURRENT SETTLEMENTS
  // =========================================

  const balances = groupBalances(group);

  const settlements = optimizeSettlements(balances, group.members || []);

  console.log("PAYMENT GROUP:", group);
  console.log("PAYMENT BALANCES:", balances);
  console.log("PAYMENT SETTLEMENTS:", settlements);

  // =========================================
  // FIND PAYMENT
  // =========================================

  const payment = settlements.find((item) => String(item.id) === String(paymentId));

  if (!payment) {
    return (
      <div className="empty-state">
        <h3>Payment not found</h3>
        <p>This payment may already be settled.</p>

        <button type="button" onClick={() => navigate(`/app/groups/${group.id}/settlement`)}>
          Back to settlement
        </button>
      </div>
    );
  }

  // =========================================
  // MEMBERS
  // =========================================

  const fromMember = payment.from;
  const toMember = payment.to;

  if (!fromMember || !toMember) {
    return (
      <div className="empty-state">
        <h3>Payment details unavailable</h3>
      </div>
    );
  }

  // =========================================
  // CHECK PAYMENT DIRECTION
  // =========================================

  const currentUserId = user?.id ? String(user.id) : null;

  const payerId = fromMember?.id ? String(fromMember.id) : null;

  const receiverId = toMember?.id ? String(toMember.id) : null;

  const isCurrentUserPayer = currentUserId && payerId === currentUserId;

  const isCurrentUserReceiver = currentUserId && receiverId === currentUserId;

  /*
   * This payment screen should only be used
   * when the logged-in user is the payer.
   */

  if (!isCurrentUserPayer) {
    return (
      <div className="empty-state">
        <h3>This isn't your payment</h3>

        {isCurrentUserReceiver ? (
          <p>
            {fromMember.name} needs to pay you ₹{Number(payment.amount).toLocaleString("en-IN")}.
          </p>
        ) : (
          <p>This settlement belongs to another group member.</p>
        )}

        <button type="button" onClick={() => navigate(`/app/groups/${group.id}/settlement`)}>
          Back to settlement
        </button>
      </div>
    );
  }

  // =========================================
  // UPI
  // =========================================

  /*
   * Do not use a fake/hardcoded UPI ID.
   *
   * This assumes your user object contains:
   *
   * upiId
   *
   * or:
   *
   * upi_id
   *
   * Add that field to your backend response if needed.
   */

  const upiId = toMember?.upi_id?.trim() || "";
  const hasUpiId = Boolean(upiId);

  // =========================================
  // COPY UPI
  // =========================================

  const copyUpiId = async () => {
    if (!upiId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(upiId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("COPY UPI ERROR:", error);
    }
  };

  // =========================================
  // CONFIRM PAYMENT
  // =========================================

  const confirmPayment = () => {
    console.log("PAYMENT CONFIRMED:", {
      groupId,
      paymentId,
      amount: payment.amount,
      from: fromMember.id,
      to: toMember.id,
    });

    /*
     * Temporary local UI behaviour.
     *
     * IMPORTANT:
     * This does NOT update the database.
     *
     * For a real settlement flow you should call:
     *
     * POST /api/groups/:groupId/settlements/:paymentId
     *
     * and update the group cache on success.
     */

    setPaid(true);
  };

  // =========================================
  // PAY VIA UPI
  // =========================================

  const handlePay = () => {
    if (!hasUpiId) {
      return;
    }

    const amount = Number(payment.amount || 0);

    const upiUrl =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent(toMember.name || "")}` +
      `&am=${amount.toFixed(2)}` +
      `&cu=INR`;

    console.log("UPI PAYMENT:", {
      selectedApp,
      upiId,
      amount,
      recipient: toMember.name,
    });

    window.location.href = upiUrl;
  };

  // =========================================
  // MARK AS PAID
  // =========================================

  const handleMarkAsPaid = () => {
    confirmPayment();
  };

  // =========================================
  // SUCCESS
  // =========================================

  if (paid) {
    return (
      <div className="payment-page">
        <div className="payment-success">
          <div className="payment-success-icon">
            <Check size={32} />
          </div>

          <h1>Payment Settled</h1>

          <p>
            ₹{Number(payment.amount).toLocaleString("en-IN")} paid to {toMember.name}.
          </p>

          <p className="payment-success-note">Your payment has been marked as settled.</p>

          <button
            type="button"
            className="payment-done-button"
            onClick={() => navigate(`/app/groups/${group.id}/settlement`)}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // PAYMENT PAGE
  // =========================================

  return (
    <div className="payment-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="payment-header">
        <button type="button" className="payment-back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className="payment-header-content">
          <span>Settlement</span>

          <h1>Pay {toMember.name}</h1>
        </div>

        <div className="payment-header-spacer" />
      </div>

      {/* =====================================
          PERSON
      ===================================== */}

      <div className="payment-person">
        <img src={toMember.avatar || "https://i.pravatar.cc/100"} alt={toMember.name} />

        <div>
          <strong>{toMember.name}</strong>

          {toMember.phone && <span>{toMember.phone}</span>}
        </div>
      </div>

      {/* =====================================
          AMOUNT
      ===================================== */}

      <div className="payment-amount-section">
        <span>You need to pay</span>

        <strong>
          ₹
          {Number(payment.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>

        <small>To {toMember.name}</small>
      </div>

      {/* =====================================
          UPI
      ===================================== */}

      {/* =====================================
    UPI
===================================== */}

      <div className={`upi-card ${!hasUpiId ? "upi-card-empty" : ""}`}>
        <div>
          <span className="upi-label">UPI ID</span>

          <strong>{hasUpiId ? upiId : "UPI ID not added"}</strong>

          {!hasUpiId && <small>{toMember.name} has not added a UPI ID yet.</small>}
        </div>

        {hasUpiId && (
          <button type="button" onClick={copyUpiId} aria-label="Copy UPI ID">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        )}
      </div>

      {/* =====================================
          UPI APPS
      ===================================== */}

      <div className="upi-app-section">
        <h2>Pay using UPI</h2>

        <div className="upi-app-grid">
          <button
            type="button"
            className={selectedApp === "phonepe" ? "selected" : ""}
            onClick={() => setSelectedApp("phonepe")}
          >
            <div className="upi-app-icon phonepe">पे</div>

            <span>PhonePe</span>
          </button>

          <button
            type="button"
            className={selectedApp === "googlepay" ? "selected" : ""}
            onClick={() => setSelectedApp("googlepay")}
          >
            <div className="upi-app-icon googlepay">G</div>

            <span>Google Pay</span>
          </button>

          <button
            type="button"
            className={selectedApp === "paytm" ? "selected" : ""}
            onClick={() => setSelectedApp("paytm")}
          >
            <div className="upi-app-icon paytm">₹</div>

            <span>Paytm</span>
          </button>

          <button
            type="button"
            className={selectedApp === "bhim" ? "selected" : ""}
            onClick={() => setSelectedApp("bhim")}
          >
            <div className="upi-app-icon bhim">↔</div>

            <span>BHIM</span>
          </button>
        </div>
      </div>

      {/* =====================================
          PAY
      ===================================== */}

      <button type="button" className="pay-upi-button" onClick={handlePay} disabled={!hasUpiId}>
        <Smartphone size={17} />

        {hasUpiId ? "Pay via UPI" : "UPI ID not available"}
      </button>

      {/* =====================================
          OR
      ===================================== */}

      <div className="payment-or">
        <span>or</span>
      </div>

      {/* =====================================
          MARK PAID
      ===================================== */}

      <button type="button" className="mark-paid-button" onClick={handleMarkAsPaid}>
        <Check size={17} />
        Mark as Paid
      </button>

      {/* =====================================
          INFO
      ===================================== */}

      <div className="payment-info">
        <Lock size={14} />

        <span>Mark the payment as paid after you've completed the transfer.</span>
      </div>
    </div>
  );
}

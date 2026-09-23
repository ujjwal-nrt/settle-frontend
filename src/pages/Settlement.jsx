import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Sparkles } from "lucide-react";

import PaymentButton from "../components/settlement/PaymentButton";

import { useGroups } from "../context/GroupContext";
import { useAuth } from "../hooks/useAuth";

import { groupBalances } from "../utils/calculations";
import { optimizeSettlements } from "../utils/settlement";
import { formatCurrency } from "../utils/currency";

export default function Settlement() {
  const { groupId } = useParams();

  const { user } = useAuth();

  const { groups, groupsLoading, groupsError } = useGroups();

  // =========================================
  // LOADING
  // =========================================

  if (groupsLoading) {
    return (
      <div className="empty-state">
        <h3>Loading settlement...</h3>
        <p>Please wait while we calculate the balances.</p>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (groupsError) {
    return (
      <div className="empty-state">
        <h3>Failed to load groups.</h3>
        <p>{groupsError?.message || "Something went wrong while loading the group."}</p>
      </div>
    );
  }

  // =========================================
  // FIND GROUP
  // =========================================

  const group = groups?.find((item) => String(item.id) === String(groupId));

  if (!group) {
    return (
      <div className="empty-state">
        <h3>Group not found.</h3>

        <Link to="/app/groups">← Back to groups</Link>
      </div>
    );
  }

  // =========================================
  // CALCULATE BALANCES
  // =========================================

  const balances = groupBalances(group);

  // =========================================
  // OPTIMIZE SETTLEMENTS
  // =========================================

  const items = optimizeSettlements(balances, group.members || []);

  console.log("SETTLEMENT GROUP:", group);
  console.log("SETTLEMENT BALANCES:", balances);
  console.log("SETTLEMENT ITEMS:", items);

  // =========================================
  // MY SETTLEMENTS
  // =========================================

  const myId = user?.id ? String(user.id) : null;

  const paymentsToMake = items.filter((item) => myId && String(item.from?.id) === myId);

  const paymentsToReceive = items.filter((item) => myId && String(item.to?.id) === myId);

  // =========================================
  // TOTALS
  // =========================================

  const totalToPay = paymentsToMake.reduce((total, item) => total + Number(item.amount || 0), 0);

  const totalToReceive = paymentsToReceive.reduce((total, item) => total + Number(item.amount || 0), 0);

  // =========================================
  // CURRENT USER BALANCE
  // =========================================

  const myBalance = myId ? Number(balances[myId] || 0) : 0;

  const isOwed = myBalance > 0.01;
  const owesMoney = myBalance < -0.01;
  const isSettled = Math.abs(myBalance) <= 0.01;

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="settlement-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="back-row">
        <Link to={`/app/groups/${group.id}`}>
          <ArrowLeft size={19} />
        </Link>

        <div>
          <span className="eyebrow">{group.name}</span>

          <h1>Smart settlement</h1>
        </div>
      </div>

      {/* =====================================
          SMART SUMMARY
      ===================================== */}

      <div className="smart-card">
        <Sparkles size={22} />

        <h2>{items.length === 0 ? "All settled up!" : "We optimized your group!"}</h2>

        <strong>
          {items.length}

          <span> payment{items.length !== 1 ? "s" : ""} left</span>
        </strong>

        <p>{items.length === 0 ? "Everyone has settled their balances." : "Fewer transfers. Same balances."}</p>
      </div>

      {/* =====================================
          YOUR BALANCE
      ===================================== */}

      <div className="settlement-balance-card">
        <div className="settlement-balance-header">
          <span>Your balance</span>

          <strong className={isOwed ? "balance-positive" : owesMoney ? "balance-negative" : "balance-settled"}>
            {formatCurrency(Math.abs(myBalance))}
          </strong>
        </div>

        {isOwed && (
          <div className="settlement-balance-status received">
            <ArrowDownLeft size={16} />

            <div>
              <strong>You are owed</strong>

              <span>Others need to pay you {formatCurrency(myBalance)}</span>
            </div>
          </div>
        )}

        {owesMoney && (
          <div className="settlement-balance-status owed">
            <ArrowUpRight size={16} />

            <div>
              <strong>You need to pay</strong>

              <span>You owe others {formatCurrency(Math.abs(myBalance))}</span>
            </div>
          </div>
        )}

        {isSettled && (
          <div className="settlement-balance-status settled">
            <Sparkles size={16} />

            <div>
              <strong>You are settled</strong>

              <span>You don't owe anyone anything.</span>
            </div>
          </div>
        )}
      </div>

      {/* =====================================
          YOU NEED TO PAY
      ===================================== */}

      {paymentsToMake.length > 0 && (
        <section className="settlement-section">
          <div className="settlement-section-header">
            <div>
              <h2>You need to pay</h2>

              <span>
                {paymentsToMake.length} payment
                {paymentsToMake.length !== 1 ? "s" : ""} · {formatCurrency(totalToPay)}
              </span>
            </div>
          </div>

          <div className="settlement-list">
            {paymentsToMake.map((payment) => (
              <div className="settlement-item" key={payment.id}>
                <div className="settlement-item-info">
                  <span className="settlement-direction">Pay</span>

                  <strong>{payment.to?.name || "Unknown"}</strong>

                  {payment.to?.email && <small>{payment.to.email}</small>}
                </div>

                <div className="settlement-item-action">
                  <strong className="settlement-amount">{formatCurrency(payment.amount)}</strong>

                  <PaymentButton groupId={group.id} payment={payment} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================
          YOU WILL RECEIVE
      ===================================== */}

      {paymentsToReceive.length > 0 && (
        <section className="settlement-section">
          <div className="settlement-section-header">
            <div>
              <h2>You will receive</h2>

              <span>
                {paymentsToReceive.length} payment
                {paymentsToReceive.length !== 1 ? "s" : ""} · {formatCurrency(totalToReceive)}
              </span>
            </div>
          </div>

          <div className="settlement-list">
            {paymentsToReceive.map((payment) => (
              <div className="settlement-item receiving" key={payment.id}>
                <div className="settlement-item-info">
                  <span className="settlement-direction">Receive</span>

                  <strong>{payment.from?.name || "Unknown"}</strong>

                  {payment.from?.email && <small>{payment.from.email}</small>}
                </div>

                <strong className="settlement-amount received">{formatCurrency(payment.amount)}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================
          ALL SETTLED
      ===================================== */}

      {items.length === 0 && (
        <div className="settlement-empty-card">
          <Sparkles size={28} />

          <h3>All settled up!</h3>

          <p>There are no pending payments in this group.</p>
        </div>
      )}

      {/* =====================================
          GROUP SUMMARY
      ===================================== */}

      {items.length > 0 && (
        <div className="settlement-footer-summary">
          <span>Total transfers</span>

          <strong>{items.length}</strong>

          <small>These are the minimum transfers needed to settleG the group.</small>
        </div>
      )}
    </div>
  );
}

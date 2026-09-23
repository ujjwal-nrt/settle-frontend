import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

import { formatCurrency } from "../../utils/currency";
import { groupBalances } from "../../utils/calculations";

export default function BalanceCard({ groups = [], currentUserId }) {
  let totalBalance = 0;

  groups.forEach((group) => {
    const balances = groupBalances(group);

    totalBalance += Number(balances[currentUserId] || 0);
  });

  const getBack = totalBalance > 0 ? totalBalance : 0;
  const give = totalBalance < 0 ? Math.abs(totalBalance) : 0;

  const isPositive = totalBalance > 0;
  const isNegative = totalBalance < 0;
  const isSettled = totalBalance === 0;

  return (
    <section
      className={`balance-card ${
        isPositive
          ? "balance-positive"
          : isNegative
          ? "balance-negative"
          : "balance-settled"
      }`}
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="balance-card-header">
        <div>
          <span className="balance-eyebrow">YOUR BALANCE</span>

          <h3>
            {isPositive
              ? "You’re owed"
              : isNegative
              ? "You owe"
              : "All settled"}
          </h3>
        </div>

        <div className="balance-status">
          {isPositive && "↗"}
          {isNegative && "↘"}
          {isSettled && "✓"}
        </div>
      </div>

      {/* =========================================
          MAIN BALANCE
      ========================================= */}

      <div className="balance-main">
        <strong>
          {isNegative ? "-" : isPositive ? "+" : ""}
          {formatCurrency(Math.abs(totalBalance))}
        </strong>

        <span>
          {isPositive &&
            `You should get ${formatCurrency(getBack)} back`}

          {isNegative &&
            `You need to pay ${formatCurrency(give)}`}

          {isSettled && "You have no outstanding balance"}
        </span>
      </div>

      {/* =========================================
          BALANCE ACTIONS
      ========================================= */}

      <div className="balance-actions">
        {/* GET BACK */}

        <div className="balance-action-card get-back">
          <div className="balance-action-top">
            <div className="balance-action-icon">
              <ArrowDownLeft size={17} />
            </div>

            <span>GET BACK</span>
          </div>

          <strong>
            {formatCurrency(getBack)}
          </strong>

          <small>
            {getBack > 0
              ? "Others owe you"
              : "Nothing to collect"}
          </small>
        </div>

        {/* GIVE */}

        <div className="balance-action-card give">
          <div className="balance-action-top">
            <div className="balance-action-icon">
              <ArrowUpRight size={17} />
            </div>

            <span>GIVE</span>
          </div>

          <strong>
            {formatCurrency(give)}
          </strong>

          <small>
            {give > 0
              ? "You need to pay"
              : "Nothing to pay"}
          </small>
        </div>
      </div>
    </section>
  );
}
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { formatCurrency } from "../../utils/currency";
import { getMyBalance } from "../../api/expenseApi";

export default function BalanceCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBalance"],
    queryFn: getMyBalance,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const totalBalance = Number(data?.balance || 0);

  const getBack = totalBalance > 0 ? totalBalance : 0;
  const give = totalBalance < 0 ? Math.abs(totalBalance) : 0;

  const isPositive = totalBalance > 0;
  const isNegative = totalBalance < 0;
  const isSettled = totalBalance === 0;

  if (isLoading) {
    return (
      <section className="balance-card balance-settled">
        <div className="balance-card-header">
          <div>
            <span className="balance-eyebrow">YOUR BALANCE</span>
            <h3>Loading...</h3>
          </div>
        </div>

        <div className="balance-main">
          <strong>—</strong>
          <span>Calculating your balance...</span>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="balance-card balance-settled">
        <div className="balance-card-header">
          <div>
            <span className="balance-eyebrow">YOUR BALANCE</span>
            <h3>Unable to load</h3>
          </div>
        </div>

        <div className="balance-main">
          <strong>—</strong>
          <span>Unable to calculate your balance</span>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`balance-card ${
        isPositive ? "balance-positive" : isNegative ? "balance-negative" : "balance-settled"
      }`}
    >
      <div className="balance-card-header">
        <div>
          <span className="balance-eyebrow">YOUR BALANCE</span>

          <h3>{isPositive ? "You’re owed" : isNegative ? "You owe" : "All settled"}</h3>
        </div>

        <div className="balance-status">
          {isPositive && "↗"}
          {isNegative && "↘"}
          {isSettled && "✓"}
        </div>
      </div>

      <div className="balance-main">
        <strong>
          {isNegative ? "-" : isPositive ? "+" : ""}
          {formatCurrency(Math.abs(totalBalance))}
        </strong>

        <span>
          {isPositive && `You should get ${formatCurrency(getBack)} back`}

          {isNegative && `You need to pay ${formatCurrency(give)}`}

          {isSettled && "You have no outstanding balance"}
        </span>
      </div>

      <div className="balance-actions">
        <div className="balance-action-card get-back">
          <div className="balance-action-content">
            <div className="balance-action-top">
              <div className="balance-action-icon">
                <ArrowDownLeft size={17} />
              </div>

              <span>GET BACK</span>
            </div>

            <strong>{formatCurrency(getBack)}</strong>

            <small>{getBack > 0 ? "Others owe you" : "Nothing to collect"}</small>
          </div>

          <img src="/images/wallet.png" alt="" className="balance-action-image" />
        </div>

        <div className="balance-action-card give">
          <div className="balance-action-content">
            <div className="balance-action-top">
              <div className="balance-action-icon">
                <ArrowUpRight size={17} />
              </div>

              <span>GIVE</span>
            </div>

            <strong>{formatCurrency(give)}</strong>

            <small>{give > 0 ? "You need to pay" : "Nothing to pay"}</small>
          </div>

          <img src="/images/give-money.png" alt="" className="balance-action-image" />
        </div>
      </div>
    </section>
  );
}

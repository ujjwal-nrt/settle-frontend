import Avatar from "../common/Avatar";
import { formatCurrency } from "../../utils/currency";
export default function SettlementCard({ item }) {
  return (
    <div className="settle-card">
      <div className="person">
        <Avatar src={item.from?.avatar} name={item.from?.name} />
        <span>{item.from?.name}</span>
      </div>
      <div className="settle-arrow">
        →<b>{formatCurrency(item.amount)}</b>
      </div>
      <div className="person">
        <Avatar src={item.to?.avatar} name={item.to?.name} />
        <span>{item.to?.name}</span>
      </div>
    </div>
  );
}

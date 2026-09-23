import SettlementCard from "./SettlementCard";
export default function SettlementList({ items }) {
  return (
    <div className="settlement-list">
      {items.length ? (
        items.map((x, i) => <SettlementCard item={x} key={i} />)
      ) : (
        <div className="empty-state">Everyone is settled up 🎉</div>
      )}
    </div>
  );
}

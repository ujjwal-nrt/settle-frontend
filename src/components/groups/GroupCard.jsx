import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/currency";

export default function GroupCard({ group }) {
  const memberCount = Number(group?.member_count || 0);
  const totalSpent = Number(group?.total_spent || 0);

  return (
    <Link to={`/app/groups/${group.id}`} className="group-card">
      <div>
        <div className="group-card-icon">{group.emoji || "👥"}</div>

        <div className="group-card-content">
          <h3>{group.name}</h3>

          <span>
            {memberCount} {memberCount === 1 ? "person" : "people"}
          </span>
        </div>
      </div>

      <div>
        <strong>{formatCurrency(totalSpent)}</strong>

        <span className="group-card-arrow">›</span>
      </div>
    </Link>
  );
}

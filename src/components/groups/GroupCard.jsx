import { Link } from "react-router-dom";

export default function GroupCard({ group }) { 

  const members = group?.members || [];
  const expenses = group?.expenses || [];

  const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);

  return (
    <Link to={`/app/groups/${group.id}`} className="group-card">
      <div>
        <div className="group-card-icon">{group.emoji || "👥"}</div>

        <div className="group-card-content">
          <h3>{group.name}</h3>

          <span>{members.length} people</span>
        </div>
      </div>

      <div>
        <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>

        <span className="group-card-arrow">›</span>
      </div>
    </Link>
  );
}

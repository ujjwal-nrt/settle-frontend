import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import { formatCurrency } from "../../utils/currency";
import { useGroups } from "../../context/GroupContext";
import Button from "../common/Button";

export default function RecentGroups() {
  const { groups, groupsLoading } = useGroups();
  const navigate = useNavigate();

  if (groupsLoading) {
    return (
      <section>
        <div className="section-title">
          <h2>Recent groups</h2>
          <Link to="/app/groups">See all</Link>
        </div>

        <div className="list-card">
          <div className="empty-state">Loading groups...</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="section-title">
        <h2>Recent groups</h2>

        <Link to="/app/groups">See all</Link>
      </div>

      <div className="list-card">
        {groups.length === 0 ? (
          <div className="empty-state">
            <p>No groups yet.</p>

            <Button onClick={() => navigate("/app/groups/create")}>
              <Plus size={18} />
              Create your first group
            </Button>
          </div>
        ) : (
          groups.slice(0, 5).map((group) => {
            return (
              <Link className="group-row" key={group.id} to={`/app/groups/${group.id}`}>
                <div className="group-icon">{group.emoji || "👥"}</div>

                <div className="row-main">
                  <b>{group.name}</b>

                  <span>{group.member_count > 0 ? `${group.member_count} people` : "Group"}</span>
                </div>

                <strong>{formatCurrency(Number(group.total_spent || 0))}</strong>

                <ChevronRight size={18} />
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import GroupCard from "../components/groups/GroupCard";
import { useGroups } from "../context/GroupContext";

export default function Groups() {
  const navigate = useNavigate();

  const { groups, groupsLoading, groupsError } = useGroups();
 
  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (groupsLoading) {
    return (
      <div>
        <div className="page-heading">
          <div>
            <span className="eyebrow">Groups</span>
            <h1>Your groups</h1>
            <p>Keep every shared expense in one place.</p>
          </div>
        </div>

        <div className="empty-state">Loading groups...</div>
      </div>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (groupsError) {
    return (
      <div>
        <div className="page-heading">
          <div>
            <span className="eyebrow">Groups</span>
            <h1>Your groups</h1>
          </div>

          <Button onClick={() => navigate("/app/groups/create")}>
            <Plus size={18} />
            New group
          </Button>
        </div>

        <div className="empty-state">Failed to load groups.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Groups</span>

          <h1>Your groups</h1>

          <p>Keep every shared expense in one place.</p>
        </div>

        <Button onClick={() => navigate("/app/groups/create")}>
          <Plus size={18} />
          New group
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <h3>No groups yet</h3>

          <p>Create your first group to start splitting expenses.</p>

          <Button onClick={() => navigate("/app/groups/create")}>
            <Plus size={18} />
            Create group
          </Button>
        </div>
      ) : (
        <div className="group-grid">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

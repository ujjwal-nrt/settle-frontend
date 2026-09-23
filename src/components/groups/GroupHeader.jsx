import { ArrowLeft, MoreVertical, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
export default function GroupHeader({ group }) {
  return (
    <>
      <div className="back-row">
        <Link to="/app/groups">
          <ArrowLeft size={19} />
        </Link>
        <div>
          <span className="eyebrow">Group</span>
          <h1>
            {group.emoji} {group.name}
          </h1>
        </div>
        <button className="icon-btn">
          <MoreVertical />
        </button>
      </div>
      <div className="member-stack">
        {group.members.map((m) => (
          <Avatar key={m.id} src={m.avatar} name={m.name} size="sm" />
        ))}
        <Link to={`/app/groups/${group.id}/expense/add`} className="small-add">
          <Plus size={16} />
        </Link>
      </div>
    </>
  );
}

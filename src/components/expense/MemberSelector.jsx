import Avatar from "../common/Avatar";
export default function MemberSelector({ members, selected, onToggle }) {
  return (
    <div className="member-select">
      {members.map((m) => (
        <button
          type="button"
          className={selected.includes(m.id) ? "selected" : ""}
          key={m.id}
          onClick={() => onToggle(m.id)}
        >
          <Avatar src={m.avatar} name={m.name} size="sm" />
          <span>{m.name}</span>
          <i>{selected.includes(m.id) ? "✓" : ""}</i>
        </button>
      ))}
    </div>
  );
}

import { Check, IndianRupee, Percent } from "lucide-react";

import Avatar from "../common/Avatar";

export default function MemberSelector({
  members,
  selected,
  onToggle,
  splitType,
  splitValues = {},
  autoSplitMemberId,
  onSplitValueChange,
}) {
  const showSplitInputs = splitType === "exact" || splitType === "percentage";

  return (
    <div className="member-select">
      {members.map((member) => {
        const isSelected = selected.includes(member.id);

        const isAutoMember = String(member.id) === String(autoSplitMemberId);

        const value = splitValues?.[member.id] ?? "";

        return (
          <div key={member.id} className={`member-select-row ${isSelected ? "selected" : ""}`}>
            {/* MEMBER */}
            <button type="button" className="member-select-main" onClick={() => onToggle(member.id)}>
              <span className={`member-checkbox ${isSelected ? "checked" : ""}`}>
                {isSelected && <Check size={13} />}
              </span>

              <Avatar src={member.avatar} name={member.name} size="sm" />

              <span className="member-select-name">{member.name}</span>
            </button>

            {/* SPLIT INPUT */}
            {showSplitInputs && isSelected && (
              <div className={`member-split-input ${isAutoMember ? "auto" : ""}`}>
                {splitType === "exact" ? <IndianRupee size={14} /> : <Percent size={14} />}

                <input
                  type="number"
                  min="0"
                  max={splitType === "percentage" ? "100" : undefined}
                  step="0.01"
                  value={value}
                  placeholder={splitType === "exact" ? "0" : "0"}
                  disabled={isAutoMember}
                  readOnly={isAutoMember}
                  onChange={(e) => onSplitValueChange?.(member.id, e.target.value)}
                />

                {/* {isAutoMember && <span className="auto-label">auto</span>} */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

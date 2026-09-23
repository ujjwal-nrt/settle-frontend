import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Check, House, Plane, Search, Smile, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupContext";

const groupTypes = [
  {
    id: "trip",
    label: "Trip",
    icon: Plane,
    emoji: "✈️",
  },
  {
    id: "home",
    label: "Home",
    icon: House,
    emoji: "🏠",
  },
  {
    id: "friends",
    label: "Friends",
    icon: UsersRound,
    emoji: "👥",
  },
  {
    id: "office",
    label: "Office",
    icon: BriefcaseBusiness,
    emoji: "💼",
  },
  {
    id: "family",
    label: "Family",
    icon: UsersRound,
    emoji: "👨‍👩‍👧",
  },
  {
    id: "other",
    label: "Other",
    icon: Smile,
    emoji: "🙂",
  },
];

export default function CreateGroup() {
  const navigate = useNavigate();
  const { addGroup, createGroupLoading, createGroupError } = useGroups();

  const [groupType, setGroupType] = useState("trip");
  const [name, setName] = useState("Goa Trip 2026");

  const selectedType = groupTypes.find((type) => type.id === groupType);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await addGroup({
        name: name.trim(),
        emoji: selectedType?.emoji || "👥",
        type: groupType,
        memberIds: [],
      });

      navigate("/app/groups");
    } catch (error) {
      console.error("CREATE GROUP ERROR:", error);
    }
  };

  return (
    <>
      <div className="create-group-page">
        <form className="create-group-form" onSubmit={handleCreateGroup}>
          {/* Header */}
          <div className="create-group-header">
            <button type="button" className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={21} />
            </button>

            <h1>Create a Group</h1>

            <div className="header-spacer" />
          </div>

          {/* Group type */}
          <section className="create-group-section">
            <h2>What's this for?</h2>

            <div className="group-type-grid">
              {groupTypes.map((type) => {
                const Icon = type.icon;
                const active = groupType === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    className={`group-type-card ${active ? "active" : ""}`}
                    onClick={() => {
                      setGroupType(type.id);

                      if (!name || name === "Goa Trip 2026") {
                        if (type.id === "trip") {
                          setName("Goa Trip 2026");
                        } else if (type.id === "home") {
                          setName("Home");
                        } else if (type.id === "friends") {
                          setName("Friends");
                        } else if (type.id === "office") {
                          setName("Office");
                        } else if (type.id === "family") {
                          setName("Family");
                        } else {
                          setName("New Group");
                        }
                      }
                    }}
                  >
                    <div className="group-type-icon">
                      <Icon size={19} />
                    </div>

                    <span>{type.label}</span>

                    {active && (
                      <div className="group-type-check">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Group name */}
          <section className="create-group-section">
            <h2>Group name</h2>

            <div className="group-name-input">
              <span className="group-name-emoji">{selectedType?.emoji || "👥"}</span>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Goa Trip 2026"
                required
              />
            </div>
          </section>

          <div className="create-group-info">
            <div className="create-group-info-icon">
              <UsersRound size={17} />
            </div>

            <div>
              <strong>Add members later</strong>
              <p>Once your group is created, you can add people and invite friends from the Members section.</p>
            </div>
          </div>

          {/* Backend error */}
          {createGroupError && (
            <div className="error-message">{createGroupError.message || "Failed to create group."}</div>
          )}

          {/* Bottom button */}
          <div className="create-group-footer">
            <button type="submit" className="create-group-button" disabled={!name.trim() || createGroupLoading}>
              <UsersRound size={18} />

              {createGroupLoading ? "Creating Group..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

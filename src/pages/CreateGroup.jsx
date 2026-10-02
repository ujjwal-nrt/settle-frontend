import { useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Check, House, Plane, Smile, UsersRound } from "lucide-react";
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

// Default names for each group type
const defaultGroupNames = {
  trip: "Goa Trip 2026",
  home: "Home",
  friends: "Friends",
  office: "Office",
  family: "Family",
  other: "New Group",
};

export default function CreateGroup() {
  const navigate = useNavigate();

  const { groups = [], groupsLoading, addGroup, createGroupLoading, createGroupError } = useGroups();

  const [groupType, setGroupType] = useState("trip");
  const [name, setName] = useState("Goa Trip 2026"); 
  // Tracks whether the user manually changed the group name
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false);

  const selectedType = groupTypes.find((type) => type.id === groupType);

  // -----------------------------------------
  // Check duplicate group name
  // -----------------------------------------

  const duplicateGroup = useMemo(() => {
    const trimmedName = name.trim();

    if (!trimmedName || groupsLoading) {
      return null;
    }

    const normalizedName = trimmedName.toLowerCase();

    return (
      groups.find(
        (group) =>
          String(group.name || "")
            .trim()
            .toLowerCase() === normalizedName,
      ) || null
    );
  }, [name, groups, groupsLoading]);

  const groupNameExists = Boolean(duplicateGroup);

  // -----------------------------------------
  // Change group type
  // -----------------------------------------

  const handleGroupTypeChange = (typeId) => {
    setGroupType(typeId);

    // Only automatically change the name
    // if user has not manually edited it.
    if (!nameManuallyEdited) {
      setName(defaultGroupNames[typeId] || "New Group");
    }
  };

  // -----------------------------------------
  // Group name change
  // -----------------------------------------

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameManuallyEdited(true);
  };

  // -----------------------------------------
  // Create group
  // -----------------------------------------

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    // Frontend duplicate protection
    if (groupNameExists) {
      return;
    }

    try {
      await addGroup({
        name: trimmedName,
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
                  onClick={() => handleGroupTypeChange(type.id)}
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

          <div className={`group-name-input ${groupNameExists ? "group-name-input-error" : ""}`}>
            <span className="group-name-emoji">{selectedType?.emoji || "👥"}</span>

            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Goa Trip 2026"
              required
              maxLength={150}
            />
          </div>

          {/* Inline duplicate warning */}
          {groupNameExists && (
            <div className="group-name-warning" role="alert">
              <span className="group-name-warning-icon">!</span>

              <div>
                <strong>You already have a group with this name.</strong>

                <p>You already have "{duplicateGroup.name}". Please choose a different name.</p>
              </div>
            </div>
          )}
        </section>

        {/* Info */}
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
          <button
            type="submit"
            className="create-group-button"
            disabled={!name.trim() || groupNameExists || createGroupLoading}
          >
            <UsersRound size={18} />

            {createGroupLoading ? "Creating Group..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Check, House, Plane, Search, Smile, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupContext";
import { shareSettleInvite } from "../utils/shareInvite";
import { addGroupPerson, checkPhone } from "../api/groupApi";
import Avatar from "../components/common/Avatar";

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
  const [search, setSearch] = useState("");

  // Contacts selected from the device and matched with registered users.
  const [contacts, setContacts] = useState([]);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const [inviteContact, setInviteContact] = useState(null);

  const selectedType = groupTypes.find((type) => type.id === groupType);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return contacts;
    }

    return contacts.filter(
      (contact) => contact.name?.toLowerCase().includes(query) || contact.phone?.toLowerCase().includes(query),
    );
  }, [contacts, search]);

  const toggleMember = (id) => {
    setSelectedMembers((current) => {
      if (current.includes(id)) {
        return current.filter((memberId) => memberId !== id);
      }

      return [...current, id];
    });
  };

  /**
   * Open device contact picker.
   *
   * The actual Android implementation will live in:
   * src/utils/deviceContacts.js
   *
   * It will return normalized contacts like:
   *
   * {
   *   name: "Rahul Sharma",
   *   phone: "+919876543210",
   *   registered: true,
   *   userId: "real-user-uuid"
   * }
   */
  const handleAddFromContacts = async () => {
    setContactError("");
    setContactLoading(true);

    try {
      const { pickContacts } = await import("../utils/deviceContacts");

      const selectedContacts = await pickContacts();

      console.log("CREATE GROUP SELECTED CONTACTS:", JSON.stringify(selectedContacts, null, 2));

      if (!selectedContacts?.length) {
        return;
      }

      const matchedContacts = [];

      for (const contact of selectedContacts) {
        console.log("CREATE GROUP CONTACT:", JSON.stringify(contact, null, 2));

        if (!contact?.phone) {
          continue;
        }

        try {
          const result = await checkPhone(contact.phone);

          console.log("CHECK PHONE RESULT:", JSON.stringify(result, null, 2));

          if (result?.registered && result?.user) {
            matchedContacts.push({
              name: result.user.name || contact.name || "Unknown",
              phone: result.user.phone || contact.phone,
              avatar: result.user.avatar || contact.avatar || null,
              registered: true,
              userId: result.user.id,
            });
          } else {
            matchedContacts.push({
              name: contact.name || "Unknown",
              phone: contact.phone,
              avatar: contact.avatar || null,
              registered: false,
              userId: null,
            });
          }
        } catch (error) {
          console.error("CHECK PHONE ERROR:", error);

          // Important: don't silently lose the contact
          matchedContacts.push({
            name: contact.name || "Unknown",
            phone: contact.phone,
            avatar: contact.avatar || null,
            registered: false,
            userId: null,
          });
        }
      }

      console.log("MATCHED CONTACTS:", JSON.stringify(matchedContacts, null, 2));

      setContacts((current) => {
        const existingPhones = new Set(current.map((item) => item.phone));

        const newContacts = matchedContacts.filter((contact) => contact.phone && !existingPhones.has(contact.phone));

        return [...current, ...newContacts];
      });
    } catch (error) {
      console.error("CONTACT PICKER ERROR:", error);

      setContactError(error?.message || "Unable to access contacts. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    /*
     * Only send real registered user IDs.
     *
     * The current contact objects will eventually contain:
     * contact.userId
     *
     * Never send fake IDs such as u1/u2/u3.
     */
    const memberIds = contacts
      .filter((contact) => contact.registered && contact.userId && selectedMembers.includes(contact.userId))
      .map((contact) => contact.userId);

    try {
      await addGroup({
        name: name.trim(),
        emoji: selectedType?.emoji || "👥",
        type: groupType,
        memberIds,
      });

      navigate("/app/groups");
    } catch (error) {
      console.error("CREATE GROUP ERROR:", error);
    }
  };

  const handleInvite = (contact) => {
    setInviteContact(contact);
  };

  const handleShareInvite = async () => {
    if (!inviteContact) return;

    await shareSettleInvite(inviteContact);

    setInviteContact(null);
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

          {/* People */}
          <section className="create-group-section people-section">
            <div className="people-heading">
              <div>
                <h2>Add people</h2>

                {selectedMembers.length > 0 && <span>{selectedMembers.length} selected</span>}
              </div>

              <button
                type="button"
                className="add-contacts-button"
                onClick={handleAddFromContacts}
                disabled={contactLoading}
              >
                <UsersRound size={18} />

                {contactLoading ? "Opening Contacts..." : "Add from Contacts"}
              </button>
            </div>

            {/* Contact error */}
            {contactError && <div className="error-message">{contactError}</div>}

            {/* Search */}
            <div className="contact-search">
              <Search size={18} />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                disabled={!contacts.length}
              />
            </div>

            {/* Contact list */}
            <div className="contact-list">
              {!contacts.length ? (
                <div className="empty-state">
                  <UsersRound size={30} />

                  <h3>No people added yet</h3>

                  <p>Tap "Add from Contacts" to choose people from your phone.</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="empty-state">
                  <p>No contacts found.</p>
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const selected = contact.registered && selectedMembers.includes(contact.userId);

                  return (
                    <button
                      type="button"
                      key={contact.userId || contact.phone}
                      className={`contact-item ${!contact.registered ? "not-registered" : ""}`}
                      onClick={() => {
                        if (contact.registered) {
                          toggleMember(contact.userId);
                        } else {
                          handleInvite(contact);
                        }
                      }}
                    >
                      <div className="contact-left">
                        {contact.avatar ? (
                          <img src={contact.avatar} alt={contact.name} />
                        ) : (
                          <Avatar src={contact.avatar} name={contact.name?.charAt(0)?.toUpperCase() || "?"} size="md" />
                        )}

                        <div className="member-info">
                          <strong>{contact.name}</strong>

                          {contact.phone && <small>{contact.phone}</small>}

                          {!contact.registered && <small className="contact-invite">Not registered</small>}
                        </div>
                      </div>

                      {contact.registered ? (
                        <div className={`contact-check ${selected ? "selected" : ""}`}>
                          {selected && <Check size={14} />}
                        </div>
                      ) : (
                        <span className="invite-label">Invite</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </section>

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

      {inviteContact && (
        <div className="invite-modal-overlay">
          <div className="invite-modal">
            <div className="invite-modal-icon">
              <UsersRound size={28} />
            </div>

            <h2>Invite {inviteContact.name}?</h2>

            <p>{inviteContact.name} isn't using SettleG yet. Invite them so they can join you and split expenses.</p>

            <div className="invite-contact-preview">
              <div className="contact-avatar-placeholder">{inviteContact.name?.charAt(0)?.toUpperCase() || "?"}</div>

              <div>
                <strong>{inviteContact.name}</strong>
                <span>{inviteContact.phone}</span>
              </div>
            </div>

            <div className="invite-modal-actions">
              <button type="button" className="invite-cancel-button" onClick={() => setInviteContact(null)}>
                Cancel
              </button>

              <button type="button" className="invite-share-button" onClick={handleShareInvite}>
                Share Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Share2, UserPlus, Loader2, UserMinus, LogOut, Phone, ChevronDown, X } from "lucide-react";

import useGroup from "../hooks/useGroup";
import Avatar from "../components/common/Avatar";
import { pickContacts } from "../utils/deviceContacts";
import { addGroupPerson, leaveGroup, removeGroupMember } from "../api/groupApi";
import { shareSettleInvite } from "../utils/shareInvite";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";

export default function GroupMembers() {
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data, isLoading, error } = useGroup(groupId);
  const group = data?.group;

  const [pendingInvites, setPendingInvites] = useState([]);
  const [adding, setAdding] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [manualPhone, setManualPhone] = useState("");

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const members = group?.members || [];
  const pendingInvitesFromServer = group?.invitations || [];

  const isOwner = String(group?.created_by) === String(user?.id);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast((current) => ({
        ...current,
        show: false,
      }));
    }, 3000);
  };

  useEffect(() => {
    if (!pendingInvites.length) return;

    const memberPhones = new Set(
      members
        .map((member) => member.phone)
        .filter(Boolean)
        .map((phone) => String(phone).replace(/\D/g, "")),
    );

    const serverPendingPhones = new Set(
      pendingInvitesFromServer
        .map((invite) => invite.phone)
        .filter(Boolean)
        .map((phone) => String(phone).replace(/\D/g, "")),
    );

    setPendingInvites((current) =>
      current.filter((invite) => {
        const phone = String(invite.phone || "").replace(/\D/g, "");

        if (memberPhones.has(phone)) {
          return false;
        }

        if (!serverPendingPhones.has(phone)) {
          return false;
        }

        return true;
      }),
    );
  }, [members, pendingInvitesFromServer]);

  // ADD PEOPLE

  const handleAddPhoneNumber = async () => {
    const phone = manualPhone.trim();

    if (!phone) {
      showToast("Enter a phone number.", "error");
      return;
    }

    try {
      setAdding(true);

      const result = await handleContact({
        name: "Invited member",
        phone,
      });

      if (result?.type === "member") {
        showToast("Member added successfully");
      } else if (result?.type === "invitation") {
        showToast("Invitation created successfully");
      }

      setManualPhone("");
      setShowPhoneInput(false);
    } catch (error) {
      console.error("ADD PHONE ERROR:", error);
      showToast(error.message || "Unable to add phone number.", "error");
    } finally {
      setAdding(false);
    }
  };

  // ADD PEOPLE

  const handleAddPeople = async () => {
    try {
      setAdding(true);

      const contacts = await pickContacts();

      console.log("SELECTED CONTACTS JSON:", JSON.stringify(contacts, null, 2));

      if (!contacts?.length) {
        console.log("NO CONTACTS SELECTED");
        return;
      }

      for (const contact of contacts) {
        const result = await handleContact(contact);

        if (result?.type === "member") {
          showToast("Member added successfully");
        } else if (result?.type === "invitation") {
          showToast("Invitation created successfully");
        }
      }
    } catch (error) {
      console.error("ADD PEOPLE ERROR:", error);
    } finally {
      setAdding(false);
    }
  };

  // HANDLE CONTACT

  const handleContact = async (contact) => {
    console.log("HANDLE CONTACT START:", JSON.stringify(contact, null, 2));

    if (!contact?.phone) {
      console.log("Contact has no phone:", contact);
      return;
    }

    try {
      const result = await addGroupPerson(groupId, {
        name: contact.name || "Unknown",
        phone: contact.phone,
      });

      console.log("ADD GROUP PERSON RESPONSE:", result);

      // REGISTERED USER

      if (result?.type === "member") {
        console.log("Registered member:", result.member);

        await queryClient.invalidateQueries({
          queryKey: ["group", groupId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["groups"],
        });

        return result;
      }

      // NOT REGISTERED

      if (result?.type === "invitation") {
        const invitation = result.invitation;

        setPendingInvites((current) => {
          if (current.some((item) => item.phone === invitation.phone)) {
            return current;
          }

          return [
            ...current,
            {
              id: invitation.id,
              name: invitation.name || contact.name || "Unknown",
              phone: invitation.phone,
              avatar: contact.avatar || null,
            },
          ];
        });

        await queryClient.invalidateQueries({
          queryKey: ["group", groupId],
        });

        console.log("INVITATION ADDED:", invitation);
        return result;
      }
    } catch (error) {
      console.error("HANDLE CONTACT ERROR:", error);
    }
  };
  // SHARE INVITE

  const handleShareInvite = async (contact) => {
    await shareSettleInvite(contact);
    showToast("Invitation created successfully");
  };

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      setActionLoading(`remove-${selectedMember.id}`);

      await removeGroupMember(groupId, selectedMember.id);
      showToast("Member removed successfully");

      setShowRemoveModal(false);
      setSelectedMember(null);

      await queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    } catch (error) {
      console.error("REMOVE MEMBER ERROR:", error);

      showToast(error.message || "Unable to remove member.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Loading members...</h3>
        <p>Please wait while we load the group members.</p>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="empty-state">
        <h3>Unable to load members</h3>

        <p>{error.message || "Something went wrong while loading members."}</p>

        <Link to={`/app/groups/${groupId}`}>← Back to group</Link>
      </div>
    );
  }

  // =========================================
  // GROUP NOT FOUND
  // =========================================

  if (!group) {
    return (
      <div className="empty-state">
        <h3>Group not found</h3>

        <Link to="/app/groups">← Back to groups</Link>
      </div>
    );
  }

  const allPendingInvites = [
    ...pendingInvitesFromServer.map((item) => ({
      id: item.id,
      name: item.name || "Unknown",
      phone: item.phone,
      avatar: null,
    })),

    ...pendingInvites.filter((local) => !pendingInvitesFromServer.some((server) => server.phone === local.phone)),
  ];

  const formatPhone = (phone) => {
    if (!phone) return "";

    const value = String(phone).trim();

    if (value.startsWith("+91")) {
      return value;
    }

    return `+91 ${value}`;
  };

  return (
    <div className="group-details-page">
      <div className="group-details-header">
        <Link to={`/app/groups/${group.id}`}>
          <ArrowLeft size={20} />
        </Link>

        <div className="group-title">
          <div className="group-title-icon">{group.emoji || "👥"}</div>

          <div>
            <h1>{group.name}</h1>

            <span>{members.length} people</span>
          </div>
        </div>

        <div />
      </div>

      {/* =====================================
          TABS
      ===================================== */}

      <div className="group-tabs">
        <Link to={`/app/groups/${group.id}`}>Overview</Link>

        <Link to={`/app/groups/${group.id}/expenses`}>Expenses</Link>

        <Link to={`/app/groups/${group.id}/members`} className="active">
          Members
        </Link>
      </div>

      {/* =====================================
          MEMBERS
      ===================================== */}

      <div className="members-page">
        {/* SECTION HEADER */}

        <div className="section-heading">
          <div>
            <h2>Group members</h2>

            <span>
              {members.length} member
              {members.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="add-member-actions">
          <button type="button" className="add-member-button" onClick={handleAddPeople} disabled={adding}>
            {adding ? (
              <>
                <Loader2 size={17} className="spin" />
                Checking...
              </>
            ) : (
              <>
                <UserPlus size={17} />
                Add from contacts
              </>
            )}
          </button>
          <button
            type="button"
            className="add-phone-button"
            onClick={() => setShowPhoneInput((current) => !current)}
            disabled={adding}
          >
            <Phone size={17} />
            Add phone number
          </button>
        </div>

        {showPhoneInput && (
          <div className="manual-phone-box">
            <div className="manual-phone-header">
              <div>
                <h3>Add phone number</h3>
                <p>Enter a phone number to invite someone who is not in your contacts.</p>
              </div>

              <button
                type="button"
                className="manual-phone-close"
                onClick={() => {
                  setShowPhoneInput(false);
                  setManualPhone("");
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="manual-phone-input-wrap">
              <div className="phone-country">
                <span className="india-flag">🇮🇳</span>
                <span>+91</span>
                <span className="phone-chevron">
                  <ChevronDown size={12} />
                </span>
              </div>

              <input
                type="tel"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                placeholder="Enter phone number"
                autoFocus
              />

              <button type="button" className="manual-phone-add" onClick={handleAddPhoneNumber} disabled={adding}>
                {adding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        )}

        {/* =====================================
            MEMBER LIST
        ===================================== */}

        <div className="members-list">
          {/* REGISTERED MEMBERS */}

          {members.map((member) => (
            <div className="member-row" key={member.id}>
              <div className="avatar-members">
                <Avatar src={member.avatar} name={member.name} size="md" />

                <div className="member-info">
                  <strong>{member.name}</strong>

                  {member.phone && <span>{formatPhone(member.phone)}</span>}

                  {member.email && <span>{member.email}</span>}
                </div>
              </div>

              <div className="member-row-action">
                {isOwner && String(member.id) !== String(user?.id) ? (
                  <button
                    type="button"
                    className="remove-member-button"
                    onClick={() => handleRemoveMember(member)}
                    disabled={actionLoading === `remove-${member.id}`}
                  >
                    {actionLoading === `remove-${member.id}` ? (
                      <>
                        <Loader2 size={14} className="spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <UserMinus size={14} />
                        Remove
                      </>
                    )}
                  </button>
                ) : (
                  <div className="member-status registered">
                    <Check size={14} />
                    On SettleG
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* ===================================
              PENDING INVITES
          =================================== */}

          {allPendingInvites.map((contact) => (
            <div className="member-row pending-member" key={contact.id}>
              <div className="avatar-members">
                <Avatar src={contact.avatar} name={contact.name} size="md" />

                <div className="member-info">
                  <strong>{contact.name}</strong>
                  <span>{formatPhone(contact.phone)}</span>
                  <small>Not on Settle</small>
                </div>
              </div>

              <button type="button" className="share-invite-button" onClick={() => handleShareInvite(contact)}>
                <Share2 size={15} />
                Share invite
              </button>
            </div>
          ))}
        </div>

        {members.length === 0 && allPendingInvites.length === 0 && (
          <div className="empty-state">
            <p>No members in this group yet.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showRemoveModal}
        onClose={() => {
          if (!actionLoading) {
            setShowRemoveModal(false);
            setSelectedMember(null);
          }
        }}
        title="Remove member"
        confirmText="Remove member"
        cancelText="Cancel"
        onConfirm={confirmRemoveMember}
        confirmLoading={selectedMember ? actionLoading === `remove-${selectedMember.id}` : false}
      >
        <div className="action-modal-content">
          <div className="action-modal-icon danger">
            <UserMinus size={22} />
          </div>

          <p>
            Remove <strong>{selectedMember?.name || "this member"}</strong> from <strong>{group?.name}</strong>?
          </p>

          <span className="action-modal-note">
            This person will no longer be an active member of this group. Their previous expenses will remain in the
            group history.
          </span>
        </div>
      </Modal>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((current) => ({
            ...current,
            show: false,
          }))
        }
      />
    </div>
  );
}

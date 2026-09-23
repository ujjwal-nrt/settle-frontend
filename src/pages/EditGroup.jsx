import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import useGroup from "../hooks/useGroup";
import { updateGroup } from "../api/groupApi";
import Toast from "../components/common/Toast";

export default function EditGroup() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGroup(groupId);

  const group = data?.group;

  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [groupEmoji, setGroupEmoji] = useState("👥");
  const [coverImage, setCoverImage] = useState("");

  const [editing, setEditing] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (!group) return;

    setGroupName(group.name || "");
    setGroupType(group.type || "");
    setGroupEmoji(group.emoji || "👥");
    setCoverImage(group.cover_image || "");
  }, [group]);

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

  const handleUpdateGroup = async () => {
    if (!group) return;

    if (!groupName.trim()) {
      showToast("Please enter a group name.", "error");
      return;
    }

    try {
      setEditing(true);

      const groupData = {
        name: groupName.trim(),
        type: groupType,
        emoji: groupEmoji,
        coverImage: coverImage || null,
      };

      await updateGroup(group.id, groupData);

      await queryClient.invalidateQueries({
        queryKey: ["group", group.id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      showToast("Group updated successfully");

      navigate(`/app/groups/${group.id}`);
    } catch (error) {
      console.error("UPDATE GROUP ERROR:", error);

      showToast(error.message || "Failed to update group", "error");
    } finally {
      setEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Loading group...</h3>
        <p>Please wait while we load the group.</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="empty-state">
        <h3>Unable to load group</h3>
        <p>{error?.message || "Group not found."}</p>
      </div>
    );
  }

  return (
    <div className="edit-group-page">
      <div className="edit-group-header">
        <button type="button" className="icon-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>Edit Group</h1>
          <p>Update your group details.</p>
        </div>
      </div>

      <div className="edit-group-card">
        <div className="form-group">
          <label>Group name</label>

          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
        </div>

        <div className="form-group">
          <label>Group type</label>

          <select value={groupType} onChange={(e) => setGroupType(e.target.value)}>
            <option value="">Select type</option>
            <option value="Trip">Trip</option>
            <option value="Home">Home</option>
            <option value="Couple">Couple</option>
            <option value="Friends">Friends</option>
            <option value="Family">Family</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Group emoji</label>

          <div className="emoji-options">
            {["👥", "✈️", "🏖️", "🏠", "🎉", "🍕", "💰", "❤️"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={groupEmoji === emoji ? "emoji-option selected" : "emoji-option"}
                onClick={() => setGroupEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Cover image</label>

          <div className="cover-options">
            {[
              "/images/group-covers/beach.jpg",
              "/images/group-covers/travel.jpg",
              "/images/group-covers/party.jpg",
              "/images/group-covers/food.jpg",
              "/images/group-covers/mountains.jpg",
            ].map((cover) => (
              <button
                key={cover}
                type="button"
                className={coverImage === cover ? "cover-option selected" : "cover-option"}
                onClick={() => setCoverImage(cover)}
              >
                <img src={cover} alt="Group cover" />
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="save-group-button" onClick={handleUpdateGroup} disabled={editing}>
          {editing ? (
            <>
              <Loader2 size={18} className="spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

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

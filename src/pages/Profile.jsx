import { useEffect, useState } from "react";
import { Check, CreditCard, LogOut, Save, Pencil, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import { updateProfile } from "../api/profileApi";
import Modal from "../components/common/Modal";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [upiId, setUpiId] = useState(user?.upi_id || "");
  const [savingUpi, setSavingUpi] = useState(false);
  const [upiSaved, setUpiSaved] = useState(false);
  const [upiError, setUpiError] = useState("");
  const [editingUpi, setEditingUpi] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // =========================================
  // LOAD UPI ID
  // =========================================

  useEffect(() => {
    setUpiId(user?.upi_id || "");
  }, [user?.upi_id]);

  // =========================================
  // SAVE UPI ID
  // =========================================

  const handleSaveUpi = async () => {
    const value = upiId.trim();

    setUpiError("");
    setUpiSaved(false);

    // =========================================
    // EMPTY UPI ID
    // UPI ID IS OPTIONAL
    // =========================================

    if (!value) {
      try {
        setSavingUpi(true);

        const response = await updateProfile({
          upi_id: null,
        });

        console.log("UPI REMOVED:", response);

        // ---------------------------------------
        // UPDATE AUTH USER
        // ---------------------------------------

        if (response?.user) {
          setUser((currentUser) => ({
            ...currentUser,
            ...response.user,
            upi_id: null,
          }));
        } else {
          setUser((currentUser) => ({
            ...currentUser,
            upi_id: null,
          }));
        }

        setUpiId("");
        setEditingUpi(false);
        setUpiSaved(true);

        setTimeout(() => {
          setUpiSaved(false);
        }, 2000);
      } catch (error) {
        console.error("REMOVE UPI ERROR:", error);

        setUpiError(error?.message || "Unable to remove UPI ID.");
      } finally {
        setSavingUpi(false);
      }

      return;
    }

    // =========================================
    // BASIC UPI FORMAT VALIDATION
    // =========================================

    const upiRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,100}@[a-zA-Z][a-zA-Z0-9._-]{1,30}$/;

    if (!upiRegex.test(value)) {
      setUpiError("Enter a valid UPI ID, e.g. ujjwal@ybl");
      return;
    }

    // =========================================
    // SAVE UPI ID
    // =========================================

    try {
      setSavingUpi(true);

      const response = await updateProfile({
        upi_id: value,
      });

      console.log("UPI PROFILE UPDATED:", response);

      // ---------------------------------------
      // GET SAVED USER FROM BACKEND
      // ---------------------------------------

      const savedUser = response?.user;

      if (savedUser) {
        setUser((currentUser) => ({
          ...currentUser,
          ...savedUser,
          upi_id: savedUser.upi_id ?? value,
        }));

        setUpiId(savedUser.upi_id ?? value);
      } else {
        setUser((currentUser) => ({
          ...currentUser,
          upi_id: value,
        }));

        setUpiId(value);
      }

      // ---------------------------------------
      // HIDE FORM AFTER SAVE
      // ---------------------------------------

      setEditingUpi(false);
      setUpiSaved(true);

      setTimeout(() => {
        setUpiSaved(false);
      }, 2000);
    } catch (error) {
      console.error("SAVE UPI ERROR:", error);

      setUpiError(error?.message || "Unable to save UPI ID.");
    } finally {
      setSavingUpi(false);
    }
  };

  // =========================================
  // EDIT UPI
  // =========================================

  const handleEditUpi = () => {
    setUpiId(user?.upi_id || "");
    setUpiError("");
    setUpiSaved(false);
    setEditingUpi(true);
  };

  // =========================================
  // CANCEL EDIT
  // =========================================

  const handleCancelEdit = () => {
    setUpiId(user?.upi_id || "");
    setUpiError("");
    setUpiSaved(false);
    setEditingUpi(false);
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="narrow-page">
      {/* =====================================
          PROFILE
      ===================================== */}

      <div className="profile-card">
        <Avatar src={user?.avatar} name={user?.name} size="xl" />

        <h1>{user?.name || "User"}</h1>

        <p>{user?.email || ""}</p>

        {user?.phone && <span className="profile-phone">{user.phone}</span>}

        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={16} />
          Log out
        </Button>
      </div>

      {/* =====================================
          PAYMENT DETAILS
      ===================================== */}

      <div className="list-card profile-payment-card">
        <div className="profile-section-heading">
          <div className="profile-section-icon">
            <CreditCard size={18} />
          </div>

          <div>
            <h2>Payment details</h2>

            <p>Add your UPI ID so group members can pay you directly.</p>
          </div>
        </div>

        {/* ===================================
            SAVED UPI
        =================================== */}

        {user?.upi_id && !editingUpi ? (
          <div className="saved-upi-card">
            <div className="saved-upi-info">
              <span className="saved-upi-label">UPI ID</span>

              <strong>{user.upi_id}</strong>

              <small>Your UPI ID is ready for settlements.</small>
            </div>

            <button type="button" className="edit-upi-button" onClick={handleEditUpi} disabled={savingUpi}>
              <Pencil size={14} />
              Edit
            </button>
          </div>
        ) : (
          <>
            {/* =================================
                UPI FORM
            ================================= */}

            <div className="profile-field">
              <label htmlFor="upi-id">
                UPI ID
                <span>Optional</span>
              </label>

              <div className="upi-input-wrap">
                <input
                  id="upi-id"
                  type="text"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setUpiSaved(false);
                    setUpiError("");
                  }}
                  placeholder="e.g. ujjwal@oksbi"
                  autoComplete="off"
                  spellCheck="false"
                  disabled={savingUpi}
                />

                {upiId && !savingUpi && <Check size={17} className="upi-input-check" />}
              </div>

              <small className="profile-field-hint">Example: yourname@bank</small>

              {upiError && <small className="profile-field-error">{upiError}</small>}

              {upiSaved && <small className="profile-field-success">UPI ID saved successfully.</small>}
            </div>

            {/* =================================
                FORM BUTTONS
            ================================= */}

            <div className="upi-form-actions">
              <button type="button" className="profile-save-button" onClick={handleSaveUpi} disabled={savingUpi}>
                {savingUpi ? (
                  "Saving..."
                ) : upiSaved ? (
                  <>
                    <Check size={16} />
                    Saved
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save UPI ID
                  </>
                )}
              </button>

              {editingUpi && (
                <button type="button" className="profile-cancel-button" onClick={handleCancelEdit} disabled={savingUpi}>
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* =====================================
          SETTINGS
      ===================================== */}

      <div className="list-card">
        <div className="balance-row">
          <span>Currency</span>
          <b>INR (₹)</b>
        </div>

        <div className="balance-row">
          <span>Language</span>
          <b>English</b>
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log out"
        confirmText="Log out"
        cancelText="Cancel"
        onConfirm={confirmLogout}
      >
        <div className="logout-modal-content">
          <div className="logout-modal-icon">
            <LogOut size={22} />
          </div>

          <p>Are you sure you want to log out of your SettleG account?</p>
        </div>
      </Modal>
    </div>
  );
}

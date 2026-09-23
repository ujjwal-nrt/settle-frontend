import { NavLink, useNavigate } from "react-router-dom";
import { Home, UsersRound, Activity, CreditCard, BarChart3, UserRound, Settings, LogOut, X, Plus } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useGroups } from "../../context/GroupContext";
import Modal from "../common/Modal";
import { useState } from "react";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { groups } = useGroups();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const firstGroup = groups?.[0];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const mainItems = [
    {
      to: "/app/dashboard",
      label: "Home",
      icon: Home,
    },
    {
      to: "/app/groups",
      label: "Groups",
      icon: UsersRound,
    },
    {
      to: "/app/activity",
      label: "Activity",
      icon: Activity,
    },
  ];

  const moneyItems = [
    {
      to: firstGroup ? `/app/groups/${firstGroup.id}/settlement` : "/app/groups",
      label: "Settlements",
      icon: CreditCard,
    },
    {
      to: firstGroup ? `/app/groups/${firstGroup.id}/insights` : "/app/groups",
      label: "Insights",
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div className={`sidebar-overlay ${open ? "show" : ""}`} onClick={onClose} />

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <NavLink to="/app/dashboard" className="sidebar-brand" onClick={onClose}>
            <span className="logo-mark"><img src="/assets/icon.jpg" alt="" /></span>

            <div>
              <div className="app-name">Settle<span>G</span></div>
              <small>Split smarter. Together.</small>
            </div>
          </NavLink>

          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Create button */}
        <button
          className="sidebar-create"
          onClick={() => {
            navigate("/app/groups/create");
            onClose();
          }}
        >
          <Plus size={19} />

          <span>Create Group</span>
        </button>

        {/* Main */}
        <div className="sidebar-section">
          <span className="sidebar-label">MENU</span>

          <nav className="sidebar-nav">
            {mainItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={onClose}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Money */}
        <div className="sidebar-section">
          <span className="sidebar-label">MONEY</span>

          <nav className="sidebar-nav">
            {moneyItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <NavLink
            to="/app/profile"
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <UserRound size={19} />

            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Settings size={19} />

            <span>Settings</span>
          </NavLink>

          <button className="sidebar-link logout-link" onClick={handleLogout}>
            <LogOut size={19} />

            <span>Log out</span>
          </button>
        </div>
      </aside>

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
    </>
  );
}

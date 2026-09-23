import { Bell, Menu } from "lucide-react";
import Avatar from "../common/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="app-icon">
        <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <div className="mobile-logo">
          <span className="logo-mark">
            <img src="/assets/icon.jpg" alt="" />
          </span>
          {/* <b>SettleG</b> */}
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="icon-btn"
          onClick={() => {
            navigate("activity");
          }}
        >
          <Bell size={19} />
        </button>

        <Avatar src={user?.avatar} name={user?.name} />
      </div>
    </header>
  );
}

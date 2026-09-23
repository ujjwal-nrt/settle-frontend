import { NavLink } from "react-router-dom";
import { Home, UsersRound, Plus, Activity, UserRound } from "lucide-react";

const items = [
  {
    to: "/app/dashboard",
    label: "Home",
    Icon: Home,
    end: true,
  },
  {
    to: "/app/groups",
    label: "Groups",
    Icon: UsersRound,
    end: true,
  },
  {
    to: "/app/groups/create",
    label: "",
    Icon: Plus,
    isFab: true,
    end: true,
  },
  {
    to: "/app/activity",
    label: "Activity",
    Icon: Activity,
    end: true,
  },
  {
    to: "/app/profile",
    label: "Profile",
    Icon: UserRound,
    end: true,
  },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, Icon, isFab, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `${isFab ? "fab-link" : ""} ${isActive && !isFab ? "active" : ""}`}
        >
          <Icon size={isFab ? 25 : 19} strokeWidth={2} />

          {label && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

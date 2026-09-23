import { Link } from "react-router-dom";
import { ChevronRight, Bell, Lock, Languages, Wallet } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Settings() {
  const { language } = useLanguage();

  const settings = [
    [Bell, "Notifications", "Expense and settlement alerts"],
    [Languages, "Language", language],
    [Wallet, "Currency", "Indian Rupee (₹)"],
    [Lock, "Privacy", "Your data, your control"],
  ];

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Preferences</h1>
          <p>Control how SettleG works for you.</p>
        </div>
      </div>

      <div className="settings-card">
        {settings.map(([I, t, s]) => (
          <Link
            key={t}
            to={t === "Privacy" ? "/privacy-policy" : t === "Language" ? "/language" : "#"}
            state={t === "Language" ? { fromSettings: true } : undefined}
            className="setting-row"
          >
            <I />

            <div className="row-main">
              <b>{t}</b>
              <span>{s}</span>
            </div>

            <ChevronRight />
          </Link>
        ))}
      </div>
    </div>
  );
}

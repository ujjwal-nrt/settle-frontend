import { useNavigate } from "react-router-dom";
import { Check, Globe } from "lucide-react";
import Button from "../components/common/Button";
import { useLanguage } from "../context/LanguageContext";
export default function Language() {
  const { language, languages, changeLanguage } = useLanguage();
  const nav = useNavigate();
  return (
    <div className="language-page">
      <div className="language-card">
        <div className="language-icon">
          <Globe />
        </div>
        <h1 className="lang-h1">Choose your language</h1>
        <p>Use SettleG in your preferred language.</p>
        <div className="language-list">
          {languages.map((l) => (
            <button className={language === l ? "selected" : ""} key={l} onClick={() => changeLanguage(l)}>
              <span>{l}</span>
              {language === l && <Check size={18} />}
            </button>
          ))}
        </div>
        <Button className="full" onClick={() => nav("/app/dashboard")}>
          Continue
        </Button>
      </div>
    </div>
  );
}

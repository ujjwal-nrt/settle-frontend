import { Link } from "react-router-dom";
import { FileText, Mic, ScanLine } from "lucide-react";
export default function ExpenseActions() {
  return (
    <div>
      <div className="section-title">
        <h2>Add expense</h2>
      </div>
      <div className="action-grid">
        <Link to="/app/groups">
          <FileText />
          <b>Text</b>
          <span>Quick entry</span>
        </Link>
        <Link to="/app/groups">
          <Mic />
          <b>Voice</b>
          <span>Voice entry</span>
        </Link>
        <button>
          <ScanLine />
          <b>Scan Bill</b>
          <span>Coming soon</span>
        </button>
      </div>
    </div>
  );
}

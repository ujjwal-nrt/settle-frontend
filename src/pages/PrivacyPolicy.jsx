import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  User,
  Users,
  Receipt,
  CreditCard,
  Database,
  Share2,
  Trash2,
  Lock,
  FileText,
  Mail,
} from "lucide-react";

import "../styles/privacy-policy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page">
      {/* HEADER */}
      <div className="privacy-policy-header">
        <Link to="/app/settings" className="privacy-back-button" aria-label="Back to settings">
          <ArrowLeft size={20} />
        </Link>

        <div className="privacy-header-content">
          <div className="privacy-header-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <span className="privacy-eyebrow">SettleG</span>
            <h1>Privacy Policy</h1>
            <p>How we collect, use and protect your information.</p>
          </div>
        </div>
      </div>

      {/* LAST UPDATED */}
      <div className="privacy-updated">
        <FileText size={16} />
        <span>Last updated: September 22, 2026</span>
      </div>

      {/* INTRO */}
      <section className="privacy-section privacy-intro">
        <p>
          SettleG ("SettleG", "we", "us", or "our") is a group expense management application that helps users create
          groups, record shared expenses, track balances, and manage settlements.
        </p>

        <p>
          This Privacy Policy explains what information we collect, how we use it, how we protect it, and what choices
          you have when using SettleG.
        </p>

        <p>By using SettleG, you agree to the practices described in this Privacy Policy.</p>
      </section>

      {/* 1 */}
      <PrivacySection number="1" icon={<Database size={20} />} title="Information We Collect">
        <p>Depending on how you use SettleG, we may collect the following information.</p>

        <PrivacySubSection icon={<User size={17} />} title="1.1 Account Information">
          <p>When you create an account, we may collect:</p>

          <PrivacyList
            items={[
              "Name",
              "Email address",
              "Phone number",
              "Password information",
              "Profile picture or avatar, if provided",
            ]}
          />

          <p>Passwords are stored in a protected form and are not stored as plain text.</p>
        </PrivacySubSection>

        <PrivacySubSection icon={<Users size={17} />} title="1.2 Group Information">
          <p>When you create or participate in a group, we may collect:</p>

          <PrivacyList
            items={[
              "Group name",
              "Group type",
              "Group emoji",
              "Group cover image",
              "Group members",
              "Group invitations",
              "Group creation information",
            ]}
          />

          <p>This information is used to provide group expense management functionality.</p>
        </PrivacySubSection>

        <PrivacySubSection icon={<Receipt size={17} />} title="1.3 Expense and Settlement Information">
          <p>When you use SettleG to record shared expenses, we may collect:</p>

          <PrivacyList
            items={[
              "Expense title",
              "Expense amount",
              "Expense category",
              "Person who paid an expense",
              "Expense participants",
              "Individual shares",
              "Settlement-related information",
              "Dates and times associated with expenses and settlements",
            ]}
          />

          <p>This information is necessary to calculate balances and help users settle shared expenses.</p>
        </PrivacySubSection>

        <PrivacySubSection icon={<CreditCard size={17} />} title="1.4 Payment Information">
          <p>SettleG may allow users to store payment-related information such as a UPI ID for settlement purposes.</p>

          <p>
            SettleG does not store bank account passwords, debit card PINs, credit card PINs, or other banking
            credentials.
          </p>

          <p>
            Users should only provide payment information that they are comfortable sharing with other members of a
            group when the application's functionality requires it.
          </p>
        </PrivacySubSection>

        <PrivacySubSection icon={<Database size={17} />} title="1.5 Device and Technical Information">
          <p>We may receive limited technical information necessary for the application to operate, such as:</p>

          <PrivacyList
            items={[
              "Device and operating-system information",
              "Application version",
              "Network-related information",
              "Error or diagnostic information",
            ]}
          />

          <p>We use this information to maintain, secure, and improve the application.</p>
        </PrivacySubSection>
      </PrivacySection>

      {/* 2 */}
      <PrivacySection number="2" icon={<ShieldCheck size={20} />} title="How We Use Your Information">
        <p>We use the information we collect to:</p>

        <PrivacyList
          items={[
            "Create and manage your SettleG account",
            "Authenticate your account",
            "Allow you to create and manage groups",
            "Add and manage group members",
            "Send and manage group invitations",
            "Record and calculate shared expenses",
            "Calculate balances and settlements",
            "Display relevant group and expense information",
            "Provide application functionality",
            "Maintain application security",
            "Detect and troubleshoot technical problems",
            "Improve the reliability and functionality of SettleG",
            "Respond to support requests",
          ]}
        />

        <p>
          We do not use your information for purposes unrelated to providing or improving SettleG unless required or
          permitted by applicable law.
        </p>
      </PrivacySection>

      {/* 3 */}
      <PrivacySection number="3" icon={<Share2 size={20} />} title="How Information Is Shared">
        <p>
          Your information may be visible to other members of a SettleG group when necessary for the group
          functionality.
        </p>

        <p>For example, group members may be able to see information such as:</p>

        <PrivacyList
          items={[
            "Your name",
            "Profile information you have provided",
            "Your participation in the group",
            "Expenses associated with you",
            "Amounts you paid or owe",
            "Settlement-related information",
          ]}
        />

        <p>We do not sell your personal information.</p>

        <p>
          We may share information with service providers that help us operate SettleG, such as hosting, database,
          authentication, infrastructure, analytics, or technical service providers, where necessary to provide the
          service.
        </p>

        <p>
          We may also disclose information when required by law, legal process, or to protect the rights, safety,
          security, or property of SettleG, our users, or others.
        </p>
      </PrivacySection>

      {/* 4 */}
      <PrivacySection number="4" icon={<Database size={20} />} title="Data Storage">
        <p>SettleG uses third-party infrastructure and database services to store and process application data.</p>

        <p>
          We take reasonable technical and organizational measures to protect information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>

        <p>However, no internet-based service can guarantee absolute security.</p>
      </PrivacySection>

      {/* 5 */}
      <PrivacySection number="5" icon={<Database size={20} />} title="Data Retention">
        <p>
          We retain account and application information for as long as necessary to provide SettleG services and
          maintain appropriate business, legal, security, and operational records.
        </p>

        <p>When information is no longer required, we may delete or anonymize it where appropriate.</p>

        <p>
          Certain information may need to be retained for a longer period when required by law or for legitimate
          security and operational purposes.
        </p>
      </PrivacySection>

      {/* 6 */}
      <PrivacySection number="6" icon={<Trash2 size={20} />} title="Account and Data Deletion">
        <p>You may request deletion of your SettleG account and associated personal information.</p>

        <p>
          Account deletion may also affect information associated with groups, expenses, memberships, invitations, and
          settlements.
        </p>

        <p>
          Some information may remain where retention is required by law, necessary to resolve disputes, prevent fraud
          or abuse, or maintain legitimate business records.
        </p>

        <p>To request account or data deletion, contact us using the contact information provided below.</p>
      </PrivacySection>

      {/* 7 */}
      <PrivacySection number="7" icon={<User size={20} />} title="Children's Privacy">
        <p>
          SettleG is not intended for children under the minimum age required to use the service under applicable law.
        </p>

        <p>
          We do not knowingly collect personal information from children where such collection is prohibited by
          applicable law.
        </p>

        <p>
          If you believe that a child has provided personal information to us improperly, please contact us so that we
          can review and take appropriate action.
        </p>
      </PrivacySection>

      {/* 8 */}
      <PrivacySection number="8" icon={<Share2 size={20} />} title="Third-Party Services">
        <p>SettleG may use third-party services to provide infrastructure and application functionality.</p>

        <p>These services may process information on our behalf and may have their own privacy policies and terms.</p>

        <p>We encourage users to review the privacy policies of third-party services where appropriate.</p>
      </PrivacySection>

      {/* 9 */}
      <PrivacySection number="9" icon={<Database size={20} />} title="Cookies and Local Storage">
        <p>
          SettleG may use browser or device storage technologies, including local storage, to maintain application
          preferences, authentication state, language preferences, or other application functionality.
        </p>

        <p>
          These technologies are used to operate and improve the application and are not intended to sell or provide
          your personal information to advertisers.
        </p>
      </PrivacySection>

      {/* 10 */}
      <PrivacySection number="10" icon={<User size={20} />} title="Your Choices and Rights">
        <p>
          Depending on your location and applicable law, you may have rights regarding your personal information,
          including the right to:
        </p>

        <PrivacyList
          items={[
            "Request access to your personal information",
            "Request correction of inaccurate information",
            "Request deletion of your information",
            "Request information about how your data is used",
            "Withdraw consent where processing is based on consent",
            "Object to or restrict certain processing where applicable",
          ]}
        />

        <p>To exercise applicable rights, contact us using the information below.</p>
      </PrivacySection>

      {/* 11 */}
      <PrivacySection number="11" icon={<Lock size={20} />} title="Data Security">
        <p>We use reasonable security measures designed to protect your information.</p>

        <p>
          These measures may include authentication controls, access controls, secure connections, password protection,
          and appropriate server-side security practices.
        </p>

        <p>
          You are also responsible for keeping your account credentials confidential and should not share your password
          with others.
        </p>
      </PrivacySection>

      {/* 12 */}
      <PrivacySection number="12" icon={<FileText size={20} />} title="Changes to This Privacy Policy">
        <p>We may update this Privacy Policy from time to time.</p>

        <p>When we make changes, we will update the "Last updated" date at the top of this Privacy Policy.</p>

        <p>
          If significant changes are made, we may provide additional notice through the application or other appropriate
          communication.
        </p>

        <p>We encourage you to periodically review this Privacy Policy.</p>
      </PrivacySection>

      {/* 13 */}
      <PrivacySection number="13" icon={<Mail size={20} />} title="Contact Us">
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or your personal information,
          please contact us at:
        </p>

        <div className="privacy-contact-card">
          <div className="privacy-contact-icon">
            <Mail size={20} />
          </div>

          <div>
            <strong>SettleG Support</strong>
            <span>[ujjwal.nrt@gmail.com]</span>
          </div>
        </div>
      </PrivacySection>

      {/* 14 */}
      <PrivacySection number="14" icon={<ShieldCheck size={20} />} title="Acceptance">
        <p>
          By using SettleG, you acknowledge that you have read and understood this Privacy Policy and agree to the
          collection and use of information as described above.
        </p>
      </PrivacySection>

      {/* FOOTER */}
      <div className="privacy-policy-footer">
        <div className="privacy-footer-logo">
          <ShieldCheck size={18} />
          <strong>SettleG</strong>
        </div>

        <span>Your expenses. Your groups. Your control.</span>
      </div>
    </div>
  );
}

/* =========================================
   REUSABLE PRIVACY SECTION
========================================= */

function PrivacySection({ number, icon, title, children }) {
  return (
    <section className="privacy-section">
      <div className="privacy-section-heading">
        <div className="privacy-section-number">{number}</div>

        <div className="privacy-section-icon">{icon}</div>

        <h2>{title}</h2>
      </div>

      <div className="privacy-section-content">{children}</div>
    </section>
  );
}

/* =========================================
   SUB SECTION
========================================= */

function PrivacySubSection({ icon, title, children }) {
  return (
    <div className="privacy-subsection">
      <div className="privacy-subsection-heading">
        <span>{icon}</span>
        <h3>{title}</h3>
      </div>

      <div className="privacy-subsection-content">{children}</div>
    </div>
  );
}

/* =========================================
   LIST
========================================= */

function PrivacyList({ items }) {
  return (
    <ul className="privacy-list">
      {items.map((item) => (
        <li key={item}>
          <span className="privacy-list-dot" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// src/components/dashboard/DashboardSkeleton.jsx

export default function DashboardSkeleton() {
  return (
    <div className="dashboard dashboard-skeleton">
      {/* Heading */}
      <div className="page-heading">
        <div>
          <div className="skeleton skeleton-eyebrow" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
        </div>
      </div>

      {/* Balance Card */}
      <section className="skeleton-balance-card">
        <div className="skeleton skeleton-balance-label" />
        <div className="skeleton skeleton-balance-amount" />

        <div className="skeleton-balance-row">
          <div className="skeleton-balance-box">
            <div className="skeleton skeleton-small" />
            <div className="skeleton skeleton-medium" />
          </div>

          <div className="skeleton-balance-box">
            <div className="skeleton skeleton-small" />
            <div className="skeleton skeleton-medium" />
          </div>
        </div>
      </section>

      {/* Expense Actions */}
      <section className="skeleton-actions">
        <div className="skeleton skeleton-action" />
        <div className="skeleton skeleton-action" />
        <div className="skeleton skeleton-action" />
      </section>

      {/* Recent Groups */}
      <section className="skeleton-section">
        <div className="skeleton skeleton-section-title" />

        <div className="skeleton-group-list">
          <div className="skeleton-group-card">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-group-content">
              <div className="skeleton skeleton-group-name" />
              <div className="skeleton skeleton-group-meta" />
            </div>
          </div>

          <div className="skeleton-group-card">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-group-content">
              <div className="skeleton skeleton-group-name" />
              <div className="skeleton skeleton-group-meta" />
            </div>
          </div>

          <div className="skeleton-group-card">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-group-content">
              <div className="skeleton skeleton-group-name" />
              <div className="skeleton skeleton-group-meta" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="skeleton-section">
        <div className="skeleton skeleton-section-title" />

        <div className="skeleton-activity-list">
          <div className="skeleton-activity-item">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-activity-content">
              <div className="skeleton skeleton-activity-line" />
              <div className="skeleton skeleton-activity-line short" />
            </div>
          </div>

          <div className="skeleton-activity-item">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-activity-content">
              <div className="skeleton skeleton-activity-line" />
              <div className="skeleton skeleton-activity-line short" />
            </div>
          </div>

          <div className="skeleton-activity-item">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-activity-content">
              <div className="skeleton skeleton-activity-line" />
              <div className="skeleton skeleton-activity-line short" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

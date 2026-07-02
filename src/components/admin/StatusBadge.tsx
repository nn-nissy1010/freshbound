'use client';

const presets: Record<string, { bg: string; text: string }> = {
  // tenant / subscription status
  active:      { bg: '#dcfce7', text: '#16a34a' },
  inactive:    { bg: '#f3f4f6', text: '#6b7280' },
  suspended:   { bg: '#fee2e2', text: '#dc2626' },
  trialing:    { bg: '#dbeafe', text: '#2563eb' },
  past_due:    { bg: '#fee2e2', text: '#dc2626' },
  canceled:    { bg: '#f3f4f6', text: '#6b7280' },
  // delivery / job status
  running:     { bg: '#dbeafe', text: '#2563eb' },
  processing:  { bg: '#dbeafe', text: '#2563eb' },
  queued:      { bg: '#fef9c3', text: '#ca8a04' },
  pending:     { bg: '#fef9c3', text: '#ca8a04' },
  paused:      { bg: '#f3f4f6', text: '#6b7280' },
  completed:   { bg: '#dcfce7', text: '#16a34a' },
  success:     { bg: '#dcfce7', text: '#16a34a' },
  failed:      { bg: '#fee2e2', text: '#dc2626' },
  warning:     { bg: '#fef3c7', text: '#d97706' },
  // email events
  sent:        { bg: '#dbeafe', text: '#2563eb' },
  opened:      { bg: '#dcfce7', text: '#16a34a' },
  replied:     { bg: '#ede9fe', text: '#7c3aed' },
  unsubscribed:{ bg: '#fef3c7', text: '#d97706' },
  // severity
  critical:    { bg: '#fee2e2', text: '#dc2626' },
  high:        { bg: '#fef3c7', text: '#d97706' },
  medium:      { bg: '#dbeafe', text: '#2563eb' },
  low:         { bg: '#f3f4f6', text: '#6b7280' },
  // api / service health
  healthy:     { bg: '#dcfce7', text: '#16a34a' },
  degraded:    { bg: '#fef3c7', text: '#d97706' },
  down:        { bg: '#fee2e2', text: '#dc2626' },
  spam:        { bg: '#fef3c7', text: '#d97706' },
  // plans
  trial:       { bg: '#fef9c3', text: '#ca8a04' },
  standard:    { bg: '#dbeafe', text: '#2563eb' },
  enterprise:  { bg: '#dcfce7', text: '#16a34a' },
  // roles
  super_admin:  { bg: '#fee2e2', text: '#dc2626' },
  tenant_admin: { bg: '#dbeafe', text: '#2563eb' },
  agency_staff: { bg: '#fef3c7', text: '#d97706' },
  support:      { bg: '#f3f4f6', text: '#6b7280' },
};

interface Props { status: string; label?: string; }

export default function StatusBadge({ status, label }: Props) {
  const key = status.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
  const c = presets[key] || { bg: '#f3f4f6', text: '#6b7280' };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {label ?? status}
    </span>
  );
}

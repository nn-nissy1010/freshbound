'use client';

const presets: Record<string, { bg: string; text: string }> = {
  active:    { bg: '#dcfce7', text: '#16a34a' },
  inactive:  { bg: '#f3f4f6', text: '#6b7280' },
  suspended: { bg: '#fee2e2', text: '#dc2626' },
  running:   { bg: '#dbeafe', text: '#2563eb' },
  queued:    { bg: '#fef9c3', text: '#ca8a04' },
  failed:    { bg: '#fee2e2', text: '#dc2626' },
  paused:    { bg: '#f3f4f6', text: '#6b7280' },
  spam:      { bg: '#fef3c7', text: '#d97706' },
  completed: { bg: '#dcfce7', text: '#16a34a' },
  warning:   { bg: '#fef3c7', text: '#d97706' },
  healthy:   { bg: '#dcfce7', text: '#16a34a' },
  degraded:  { bg: '#fef3c7', text: '#d97706' },
  down:      { bg: '#fee2e2', text: '#dc2626' },
  trial:     { bg: '#ede9fe', text: '#7c3aed' },
  standard:  { bg: '#dbeafe', text: '#2563eb' },
  enterprise:{ bg: '#fef3c7', text: '#d97706' },
  super_admin:{ bg: '#ede9fe', text: '#7c3aed' },
  agency_staff:{ bg: '#fef3c7', text: '#b45309' },
  tenant_admin:{ bg: '#e0f2fe', text: '#0369a1' },
  support:   { bg: '#dbeafe', text: '#2563eb' },
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

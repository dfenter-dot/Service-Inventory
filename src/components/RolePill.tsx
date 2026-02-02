import React from 'react';
import type { Role } from '../types/core';

const roles: { label: string; value: Role }[] = [
  { label: 'Technician', value: 'technician' },
  { label: 'Service Mgr', value: 'service_manager' },
  { label: 'Warehouse', value: 'warehouse_manager' },
  { label: 'Owner', value: 'owner' }
];

export function getRole(): Role {
  const r = localStorage.getItem('si_role') as Role | null;
  return r ?? 'technician';
}

export function setRole(role: Role) {
  localStorage.setItem('si_role', role);
  window.dispatchEvent(new Event('si_role_change'));
}

export default function RolePill() {
  const [role, setRoleState] = React.useState<Role>(getRole());

  React.useEffect(() => {
    const on = () => setRoleState(getRole());
    window.addEventListener('si_role_change', on);
    return () => window.removeEventListener('si_role_change', on);
  }, []);

  return (
    <div className="card" style={{ padding: 8, boxShadow: 'none' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Role</span>
        <select
          value={role}
          onChange={(e) => {
            const v = e.target.value as Role;
            setRole(v);
            setRoleState(v);
          }}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

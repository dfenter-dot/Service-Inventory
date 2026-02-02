import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '../features/brand/useBranding';
import RolePill from '../components/RolePill';

export default function Layout({ children }: { children: React.ReactNode }) {
  useBranding();
  return (
    <div>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary)' }} />
            <div>
              <div style={{ fontWeight: 800 }}>Service Inventory</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Company-owned workflow</div>
            </div>
          </Link>
          <RolePill />
        </div>
      </header>
      <main className="container" style={{ paddingTop: 16, paddingBottom: 24 }}>{children}</main>
    </div>
  );
}

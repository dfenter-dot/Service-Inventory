import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>Service Inventory</div>
        <div style={{ color: 'var(--muted)', marginTop: 6 }}>
          Role-based inventory, projects, tools, and purchase orders for small electrical service businesses.
        </div>
        <div className="row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
          <Link className="btn primary" to="/dashboard">Go to Dashboard</Link>
          <Link className="btn" to="/setup">Owner Setup & Branding</Link>
        </div>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 800 }}>What’s in this starter build</div>
        <ul style={{ marginTop: 8, color: 'var(--muted)', lineHeight: 1.6 }}>
          <li>Role switcher (top right) for quick testing</li>
          <li>Owner dashboard skeleton + key reports placeholders</li>
          <li>Warehouse purchase order creator + printable template (v1)</li>
        </ul>
      </div>
    </div>
  );
}

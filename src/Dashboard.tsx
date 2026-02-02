import React from 'react';
import { getRole } from '../components/RolePill';
import PurchaseOrderBuilder from '../features/po/PurchaseOrderBuilder';

function Section({title,children}:{title:string;children:React.ReactNode}){
  return (
    <div className="card" style={{padding:18}}>
      <div style={{fontSize:16,fontWeight:900}}>{title}</div>
      <div style={{marginTop:12}}>{children}</div>
    </div>
  );
}

export default function Dashboard(){
  const [role,setRole]=React.useState(getRole());
  React.useEffect(()=>{
    const on=()=>setRole(getRole());
    window.addEventListener('si_role_change',on);
    return ()=>window.removeEventListener('si_role_change',on);
  },[]);

  return (
    <div className="col" style={{gap:16}}>
      {role==='technician' && (
        <Section title="Technician Home">
          <div style={{color:'var(--muted)'}}>Starter view for testing. Next: job completion flow + project completion reconciliation.</div>
          <ul style={{color:'var(--muted)',lineHeight:1.6}}>
            <li>Complete job: search materials, quantities, signature, submit</li>
            <li>Project completion: kit remaining + used-from-truck toggles</li>
            <li>Request materials/tools + borrow tools with signatures</li>
          </ul>
        </Section>
      )}

      {role==='service_manager' && (
        <Section title="Service Manager Home">
          <div style={{color:'var(--muted)'}}>Starter view for testing. Next: inbox approvals + job stubs + calendar.</div>
          <ul style={{color:'var(--muted)',lineHeight:1.6}}>
            <li>Inbox: approve/return technician reports</li>
            <li>Job stubs: pre-assign job # to tech</li>
            <li>Projects: approve kits, permit-required badge</li>
          </ul>
        </Section>
      )}

      {role==='warehouse_manager' && (
        <>
          <Section title="Warehouse Manager Home">
            <div style={{color:'var(--muted)'}}>Starter view for testing. Next: restock queue, wire threshold queue, returns intake, reorder batches.</div>
            <ul style={{color:'var(--muted)',lineHeight:1.6}}>
              <li>Restock trucks based on approved usage</li>
              <li>Wire replenishment when remaining drops below threshold</li>
              <li>Project fulfillment + vendor ordering</li>
            </ul>
          </Section>
          <PurchaseOrderBuilder />
        </>
      )}

      {role==='owner' && (
        <>
          <Section title="Owner Dashboard">
            <div className="row" style={{flexWrap:'wrap'}}>
              <div className="card" style={{padding:14,boxShadow:'none',minWidth:220}}>
                <div style={{color:'var(--muted)',fontWeight:800,fontSize:12}}>Company inventory value</div>
                <div style={{fontSize:28,fontWeight:900}}>$—</div>
                <div style={{color:'var(--muted)',fontSize:12}}>Materials + tools + equipment</div>
              </div>
              <div className="card" style={{padding:14,boxShadow:'none',minWidth:220}}>
                <div style={{color:'var(--muted)',fontWeight:800,fontSize:12}}>Top used materials (30 days)</div>
                <div style={{fontWeight:900}}>—</div>
                <div style={{color:'var(--muted)',fontSize:12}}>Bar chart in v1 reports page</div>
              </div>
              <div className="card" style={{padding:14,boxShadow:'none',minWidth:220}}>
                <div style={{color:'var(--muted)',fontWeight:800,fontSize:12}}>Tracking compliance</div>
                <div style={{fontWeight:900}}>—</div>
                <div style={{color:'var(--muted)',fontSize:12}}>Techs behind/on-time</div>
              </div>
            </div>
          </Section>
          <Section title="Owner Reports (next)">
            <div style={{color:'var(--muted)'}}>Next build step: real reports backed by Supabase data + charts (truck value by category, top-used materials, dead stock, tool accountability).</div>
          </Section>
        </>
      )}
    </div>
  );
}

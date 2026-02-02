import React from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

type Line = { description: string; qty: number; unit?: string; part?: string };

export default function PurchaseOrderBuilder(){
  const [vendor,setVendor]=React.useState('');
  const [vendorEmail,setVendorEmail]=React.useState('');
  const [job,setJob]=React.useState('');
  const [lines,setLines]=React.useState<Line[]>([{description:'',qty:1,unit:'ea',part:''}]);
  const [notes,setNotes]=React.useState('');
  const [msg,setMsg]=React.useState('');

  const addLine=()=>setLines([...lines,{description:'',qty:1,unit:'ea',part:''}]);
  const update=(i:number,k:keyof Line,v:any)=>{
    setLines(ls=>ls.map((l,idx)=>idx===i?{...l,[k]:v}:l));
  };

  const save=async()=>{
    if(!vendor.trim()){setMsg('Vendor name is required.');return;}
    if(!isSupabaseConfigured||!supabase){setMsg('Saved locally (no Supabase configured).');localStorage.setItem('si_po_draft',JSON.stringify({vendor,vendorEmail,job,lines,notes}));return;}
    const { data:po, error }=await supabase.from('purchase_orders').insert({
      vendor_name:vendor,
      vendor_email:vendorEmail||null,
      job_number:job||null,
      notes:notes||null,
      status:'draft'
    }).select('*').single();
    if(error){setMsg(`Error: ${error.message}`);return;}
    const poId=po.id;
    const lineRows=lines.filter(l=>l.description.trim()).map(l=>({
      purchase_order_id:poId,
      part_number:l.part||null,
      description:l.description,
      qty:l.qty,
      unit:l.unit||null
    }));
    if(lineRows.length){
      const { error:le }=await supabase.from('purchase_order_lines').insert(lineRows);
      if(le){setMsg(`Saved PO but line error: ${le.message}`);return;}
    }
    setMsg(`Saved PO ${po.po_number ?? po.id} to Supabase.`);
  };

  const print=()=>{
    const payload={vendor,vendorEmail,job,lines,notes};
    const w=window.open('', '_blank');
    if(!w) return;
    w.document.write(renderPrintableHtml(payload));
    w.document.close();
    w.focus();
    w.print();
  };

  const mailto=()=>{
    const subject=encodeURIComponent(`Purchase Order${job?` - Job ${job}`:''}`);
    const body=encodeURIComponent(`Hi ${vendor},\n\nPlease see the attached Purchase Order.\n\n(Use the Print button to save as PDF and attach.)\n\nThanks!`);
    const to=vendorEmail||'';
    window.location.href=`mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="col" style={{gap:12}}>
      <div className="card" style={{padding:16}}>
        <div style={{fontWeight:900,fontSize:16}}>Create Purchase Order</div>
        <div className="row" style={{flexWrap:'wrap',marginTop:12}}>
          <label style={{flex:1,minWidth:220}}>
            <div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Vendor name</div>
            <input value={vendor} onChange={e=>setVendor(e.target.value)} style={inputStyle} />
          </label>
          <label style={{flex:1,minWidth:220}}>
            <div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Vendor email (optional)</div>
            <input value={vendorEmail} onChange={e=>setVendorEmail(e.target.value)} style={inputStyle} />
          </label>
          <label style={{minWidth:160}}>
            <div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Job # (optional)</div>
            <input value={job} onChange={e=>setJob(e.target.value)} style={inputStyle} />
          </label>
        </div>

        <div style={{marginTop:14,fontWeight:800}}>Line items</div>
        <div className="col" style={{gap:8,marginTop:8}}>
          {lines.map((l,i)=>(
            <div key={i} className="row" style={{flexWrap:'wrap'}}>
              <input placeholder="Part # (optional)" value={l.part??''} onChange={e=>update(i,'part',e.target.value)} style={{...inputStyle,minWidth:140}} />
              <input placeholder="Description" value={l.description} onChange={e=>update(i,'description',e.target.value)} style={{...inputStyle,flex:1,minWidth:240}} />
              <input type="number" min={0} value={l.qty} onChange={e=>update(i,'qty',Number(e.target.value))} style={{...inputStyle,width:110}} />
              <input placeholder="Unit" value={l.unit??''} onChange={e=>update(i,'unit',e.target.value)} style={{...inputStyle,width:90}} />
              <button className="btn" onClick={()=>setLines(ls=>ls.filter((_,idx)=>idx!==i))}>Remove</button>
            </div>
          ))}
          <button className="btn" onClick={addLine} style={{alignSelf:'flex-start'}}>+ Add line</button>
        </div>

        <label style={{marginTop:12}}>
          <div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Notes (optional)</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} style={{...inputStyle,width:'100%'}} />
        </label>

        <div className="row" style={{marginTop:12,flexWrap:'wrap'}}>
          <button className="btn primary" onClick={save}>Save</button>
          <button className="btn" onClick={print}>Print / Save as PDF</button>
          <button className="btn" onClick={mailto}>Email vendor (mailto)</button>
          <span style={{color:'var(--muted)'}}>{msg}</span>
        </div>

        <div style={{marginTop:12,color:'var(--muted)',fontSize:13}}>
          Email sending is stubbed via mailto for v1 testing. A Supabase Edge Function (SendGrid/Resend) can be added next for one-click emailing.
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 12,
  border: '1px solid var(--border)'
};

function renderPrintableHtml(p:{vendor:string;vendorEmail:string;job:string;lines:Line[];notes:string}){
  const brand = JSON.parse(localStorage.getItem('si_brand')||'{}');
  const primary = brand.primary||'#2563eb';
  const company = 'Company';
  const companyName = 'Service Inventory';
  const rows = p.lines.filter(l=>l.description.trim()).map(l=>`<tr><td>${esc(l.part||'')}</td><td>${esc(l.description)}</td><td style="text-align:right">${l.qty}</td><td>${esc(l.unit||'')}</td></tr>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Purchase Order</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:32px;color:#111827}
.header{display:flex;justify-content:space-between;align-items:flex-start}
.brand{display:flex;gap:12px;align-items:center}
.logo{width:44px;height:44px;border-radius:12px;background:${primary}}
.h1{font-size:22px;font-weight:900;margin:0}
.small{color:#6b7280;font-size:12px}
.card{border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin-top:14px}
table{width:100%;border-collapse:collapse;margin-top:10px}
th,td{border-bottom:1px solid #e5e7eb;padding:10px;font-size:13px}
th{text-align:left;color:#6b7280;font-weight:800}
</style></head><body>
<div class="header">
  <div class="brand"><div class="logo"></div><div><div class="h1">${esc(companyName)}</div><div class="small">Purchase Order</div></div></div>
  <div style="text-align:right"><div style="font-weight:800">Vendor</div><div>${esc(p.vendor)}</div><div class="small">${esc(p.vendorEmail||'')}</div></div>
</div>
<div class="card"><div style="display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap">
  <div><div class="small">Job #</div><div style="font-weight:800">${esc(p.job||'—')}</div></div>
  <div><div class="small">Requested by</div><div style="font-weight:800">Warehouse Manager</div></div>
  <div><div class="small">Date</div><div style="font-weight:800">${new Date().toLocaleDateString()}</div></div>
</div></div>
<div class="card">
  <div style="font-weight:800">Line Items</div>
  <table><thead><tr><th>Part #</th><th>Description</th><th style="text-align:right">Qty</th><th>Unit</th></tr></thead><tbody>
  ${rows || '<tr><td colspan="4" class="small">(No items)</td></tr>'}
  </tbody></table>
  ${p.notes?`<div style="margin-top:12" class="small"><b>Notes:</b> ${esc(p.notes)}</div>`:''}
</div>
<div class="small" style="margin-top:14">Generated by Service Inventory. Branding colors come from your Owner settings.</div>
</body></html>`;
}

function esc(s:string){
  return s.replace(/[&<>"']/g,(c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] as string));
}

import React from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Setup(){
  const [name,setName]=React.useState('Quad2 Electric');
  const [primary,setPrimary]=React.useState('#2563eb');
  const [secondary,setSecondary]=React.useState('#111827');
  const [accent,setAccent]=React.useState('#10b981');
  const [msg,setMsg]=React.useState<string>('');

  const apply=()=>{
    const root=document.documentElement;
    root.style.setProperty('--primary',primary);
    root.style.setProperty('--text',secondary);
    root.style.setProperty('--accent',accent);
    localStorage.setItem('si_brand',JSON.stringify({primary,secondary,accent}));
  };

  const save=async()=>{
    apply();
    if(!isSupabaseConfigured||!supabase){
      setMsg('Saved locally. Add Supabase env vars to persist.');
      return;
    }
    const { error }=await supabase.from('company_profile').upsert({
      id:'00000000-0000-0000-0000-000000000000',
      name,
      brand_primary:primary,
      brand_secondary:secondary,
      brand_accent:accent
    });
    setMsg(error?`Error: ${error.message}`:'Saved to Supabase.');
  };

  return (
    <div className="col" style={{gap:16}}>
      <div className="card" style={{padding:18}}>
        <div style={{fontSize:18,fontWeight:900}}>Owner Setup & Branding</div>
        <div style={{color:'var(--muted)',marginTop:6}}>Company name + three brand colors.</div>
        <div className="col" style={{gap:10,marginTop:14}}>
          <label>
            <div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Company name</div>
            <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:10,borderRadius:12,border:'1px solid var(--border)'}} />
          </label>
          <div className="row" style={{flexWrap:'wrap'}}>
            <label><div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Primary</div><input type="color" value={primary} onChange={e=>setPrimary(e.target.value)} /></label>
            <label><div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Secondary</div><input type="color" value={secondary} onChange={e=>setSecondary(e.target.value)} /></label>
            <label><div style={{fontSize:12,color:'var(--muted)',fontWeight:700}}>Accent</div><input type="color" value={accent} onChange={e=>setAccent(e.target.value)} /></label>
          </div>
          <div className="row" style={{flexWrap:'wrap'}}>
            <button className="btn" onClick={apply}>Preview</button>
            <button className="btn primary" onClick={save}>Save</button>
          </div>
          {msg?<div style={{color:'var(--muted)'}}>{msg}</div>:null}
        </div>
      </div>
      <div className="card" style={{padding:18}}>
        <div style={{fontWeight:800}}>Logo extraction (next)</div>
        <div style={{color:'var(--muted)',marginTop:6}}>This starter build uses manual color pickers. The palette-from-logo step can be added next.</div>
      </div>
    </div>
  );
}

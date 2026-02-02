import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

function applyVars(primary?: string, secondary?: string, accent?: string) {
  const root = document.documentElement;
  if (primary) root.style.setProperty('--primary', primary);
  if (secondary) root.style.setProperty('--text', secondary);
  if (accent) root.style.setProperty('--accent', accent);
}

export function useBranding() {
  useEffect(() => {
    const cached = localStorage.getItem('si_brand');
    if (cached) {
      try {
        const b = JSON.parse(cached);
        applyVars(b.primary, b.secondary, b.accent);
      } catch {}
    }

    (async () => {
      if (!isSupabaseConfigured || !supabase) return;
      const { data } = await supabase.from('company_profile').select('brand_primary,brand_secondary,brand_accent').limit(1).maybeSingle();
      if (data) {
        applyVars(data.brand_primary ?? undefined, data.brand_secondary ?? undefined, data.brand_accent ?? undefined);
        localStorage.setItem('si_brand', JSON.stringify({ primary: data.brand_primary, secondary: data.brand_secondary, accent: data.brand_accent }));
      }
    })();
  }, []);
}

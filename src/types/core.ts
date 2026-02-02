export type Role = 'technician' | 'service_manager' | 'warehouse_manager' | 'owner';

export type CompanyProfile = {
  id: string;
  name: string;
  logo_url?: string;
  brand_primary?: string;
  brand_secondary?: string;
  brand_accent?: string;
};

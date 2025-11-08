export type MaterialType = 'banner' | 'social' | 'email' | 'document';

export interface MarketingMaterial {
  id: string;
  title: string;
  description: string | null;
  type: MaterialType;
  file_url: string | null;
  thumbnail_url: string | null;
  dimensions: string | null;
  file_size: number | null;
  download_count: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarketingMaterialFormData {
  title: string;
  description: string;
  type: MaterialType;
  dimensions?: string;
  file?: File;
}

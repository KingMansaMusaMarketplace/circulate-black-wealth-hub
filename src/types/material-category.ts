import { MaterialType } from './marketing-material';

export interface MaterialCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaterialTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaterialWithCategoriesAndTags {
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
  categories: Array<{
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export type SectorType = 'BAKERY' | 'DAIRY' | 'SWEETS' | 'CONFECTIONERY' | string;

export interface Category {
  id: number;
  name: string;
  sector: SectorType;
  sector_display?: string;
  description?: string;
  image?: string | null;
  is_active: boolean;
  metadata?: {
    supports_subscriptions?: boolean;
    supports_customization?: boolean;
    supports_preorder?: boolean;
    supports_combos?: boolean;
    popular_subcategories?: string[];
    [key: string]: any;
  };
  created_at: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: number;
  category_name?: string;
  category_sector?: SectorType;
  category_detail?: Category;
  subcategory_name?: string;
  description?: string;
  price: string;
  discount_price?: string | null;
  tax_percentage?: string;
  unit: string;
  stock_quantity: number;
  is_available: boolean;
  is_active: boolean;
  image?: string | null;
  brand?: string;
  tags?: string[];
  attributes?: Record<string, any>;
  created_at: string;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  category: number;
  subcategory_name?: string;
  description?: string;
  price: string;
  discount_price?: string | null;
  tax_percentage?: string;
  unit: string;
  stock_quantity?: number;
  is_available?: boolean;
  is_active?: boolean;
  image?: string | null;
  brand?: string;
  tags?: string[];
  attributes?: Record<string, any>;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  mobile_number?: string;
  whatsapp_number?: string;
  addresses?: any[];
  is_staff: boolean;
  is_superuser: boolean;
  is_admin?: boolean;
  created_at?: string;
  token?: string;
}

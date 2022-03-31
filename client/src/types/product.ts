export interface ProductDB {
  id: string;
  shop_id: string;
  manufacturer_id: string | null;
  brand: string | null;
  name: string;
  model_number: string | null;
  mpn: string | null;
  gtin: string | null;
  gtin_type: string | null;
  description: string;
  min_price: number;
  max_price: number | null;
  origin_country: string;
  has_variant: boolean;
  requires_shipping: boolean;
  downloadable: string | null;
  slug: string;
  sale_count: string;
  active: boolean;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProductTezos {
  id: string;
  shopId: string;
  manufacturerId: string | null;
  brand: string | null;
  name: string;
  modelNumber: string | null;
  mpn: string | null;
  gtin: string | null;
  gtinType: string | null;
  description: string;
  minPrice: number;
  maxPrice: number | null;
  originCountry: string;
  hasVariant: boolean;
  requiresShipping: boolean;
  downloadable: string | null;
  slug: string;
  saleCount: string;
  active: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

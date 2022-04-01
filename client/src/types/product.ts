export interface ProductDB {
  id: number;
  shop_id: number;
  manufacturer_id: number;
  brand: string;
  name: string;
  model_number: string;
  mpn: string;
  gtin: string;
  gtin_type: string;
  description: string;
  min_price: number;
  max_price: number;
  origin_country: string;
  has_variant: boolean;
  requires_shipping: boolean;
  downloadable: string;
  slug: string;
  sale_count: string;
  active: boolean;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProductTezos {
  id: number;
  shopId: number;
  manufacturerId: number;
  brand: string;
  name: string;
  modelNumber: string;
  mpn: string;
  gtin: string;
  gtinType: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  originCountry: string;
  hasVariant: boolean;
  requiresShipping: boolean;
  downloadable: string;
  slug: string;
  saleCount: string;
  active: boolean;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

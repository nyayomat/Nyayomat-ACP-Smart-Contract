export interface ProductDB {
  id: string;
  shop_id: string;
  manufacturer_id: string;
  brand: string;
  name: string;
  model_number: string;
  mpn: string;
  gtin: string;
  gtin_type: string;
  description: string;
  min_price: string;
  max_price: string;
  origin_country: string;
  has_variant: boolean;
  requires_shipping: boolean;
  downloadable: string;
  slug: string;
  sale_count: string;
  active: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProductTezos {
  id: string;
  shopId: string;
  manufacturerId: string;
  brand: string;
  name: string;
  modelNumber: string;
  mpn: string;
  gtin: string;
  gtinType: string;
  description: string;
  minPrice: string;
  maxPrice: string;
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

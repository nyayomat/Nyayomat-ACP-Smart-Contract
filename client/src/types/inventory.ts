export interface InventoryDB {
  id: string;
  shop_id: string;
  title: string;
  warehouse_id: string;
  product_id: string;
  brand: string;
  supplier_id: string;
  sku: string;
  condition: string;
  condition_note: string;
  description: string;
  key_features: string;
  stock_quantity: number;
  damaged_quantity: string;
  user_id: string;
  purchase_price: string;
  sale_price: number;
  offer_price: number;
  offer_start: string;
  offer_end: string;
  shipping_weight: number;
  free_shipping: boolean;
  available_from: string;
  min_order_quantity: number;
  slug: string;
  linked_items: string;
  meta_title: string;
  meta_description: string;
  stuff_pick: string;
  active: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  customer_points_discount_percentage: number;
}

export interface InventoryTezos {
  id: string;
  shopID: string;
  title: string;
  warehouseID: string;
  productID: string;
  brand: string;
  supplierID: string;
  sku: string;
  condition: string;
  conditionNote: string;
  description: string;
  keyFeatures: string;
  stockQuantity: number;
  damagedQuantity: string;
  userID: string;
  purchasePrice: string;
  salePrice: number;
  offerPrice: number;
  offerStart: string;
  offerEnd: string;
  shippingWeight: number;
  freeShipping: boolean;
  availableFrom: string;
  minOrderQuantity: number;
  slug: string;
  linkedItems: string;
  metaTitle: string;
  metaDescription: string;
  stuffPick: string;
  active: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  customerPointsDiscountPercentage: number;
}

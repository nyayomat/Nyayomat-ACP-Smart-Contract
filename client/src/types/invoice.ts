export interface InvoiceDB {
  id: number;
  user_id: number;
  shop_id: number;
  provider_id: number;
  total: string;
  tax: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
}

export interface InvoiceTezos {
  id: number;
  userId: number;
  shopId: number;
  providerId: number;
  total: string;
  tax: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

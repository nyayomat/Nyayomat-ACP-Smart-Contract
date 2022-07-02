export interface InvoiceDB {
  id: string;
  user_id: string;
  shop_id: string;
  provider_id: string;
  total: number;
  tax: number;
  deleted_at: string;
  updated_at: string;
  created_at: string;
}

export interface InvoiceTezos {
  id: string;
  userId: string;
  shopId: string;
  providerId: string;
  total: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

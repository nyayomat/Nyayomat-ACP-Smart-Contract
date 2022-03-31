export interface InvoiceDB {
  id: string;
  user_id: string;
  shop_id: string;
  provider_id: string;
  total: string;
  tax: number;
  deleted_at: Date | null;
  updated_at: Date;
  created_at: Date;
}

export interface InvoiceTezos {
  id: string;
  userId: string;
  shopId: string;
  providerId: string;
  total: string;
  tax: number;
  createdAt: Date | null;
  updatedAt: Date;
  deletedAt: Date;
}

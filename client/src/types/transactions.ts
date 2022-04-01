export interface TransactionDB {
  id: string;
  order_id?: string;
  asset_id: string;
  merchant_id?: string;
  asset_provider_id?: string;
  due_date: Date;
  paid_on: Date;
  type: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface TransactionTezos {
  id: string;
  assetProviderId?: string;
  merchantId?: string;
  orderId?: string;
  assetId: string;
  dueDate: Date;
  paidOn: Date;
  txType: string;
  initiator: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

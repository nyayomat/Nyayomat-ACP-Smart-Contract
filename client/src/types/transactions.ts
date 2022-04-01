export interface TransactionDB {
  id: string;
  order_id?: string;
  asset_id: string;
  merchant_id?: string;
  asset_provider_id?: string;
  due_date: string;
  paid_on: string;
  type: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionTezos {
  id: string;
  assetProviderId?: string;
  merchantId?: string;
  orderId?: string;
  assetId: string;
  dueDate: string;
  paidOn: string;
  txType: string;
  initiator: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

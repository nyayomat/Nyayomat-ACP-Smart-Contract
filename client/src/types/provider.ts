export interface ProviderDB {
  id: string;
  shop_name: string;
  operating_days: string;
  status: string;
  deleted_at: Date | null;
  updated_at: Date;
  created_at: Date;
}

export interface ProviderTezos {
  id: string;
  shopName: string;
  operatingDays: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date;
  deletedAt: Date;
}

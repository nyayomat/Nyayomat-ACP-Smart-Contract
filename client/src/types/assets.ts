export interface AssetDB {
  id: number;
  asset_provider_id: number;
  asset_name: string;
  group_id?: number;
  sub_group_id?: number;
  category_id?: number;
  image?: string;
  units: string;
  unit_cost: number;
  holiday_provision: number;
  deposit_amount: number;
  installment: number;
  total_outstanding_amount: number;
  payment_frequency: string;
  payment_method: string;
  status: string;
  owner?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AssetTezos {
  id: number;
  providerId: number;
  name: string;
  groupId?: number | null;
  subGroupId?: number | null;
  categoryId?: number | null;
  image?: string | null;
  units: string;
  unitCost: number;
  holidayProvision: number;
  depositAmount: number;
  installment: number;
  totalOutstandingAmount?: number | null;
  paymentFreq: string;
  paymentMethod: string;
  status: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

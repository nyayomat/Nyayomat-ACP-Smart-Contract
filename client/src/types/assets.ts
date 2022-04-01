export interface AssetDB {
  id: number;
  asset_provider_id: number;
  asset_name: string;
  group_id?: string;
  sub_group_id?: string;
  category_id?: string;
  image?: string;
  units: string;
  unit_cost: number;
  holiday_provision: number;
  deposit_amount: number;
  installment: number;
  total_out_standing_amount: number;
  payment_frequency: string;
  payment_method: string;
  status: string;
  owner?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetTezos {
  id: number;
  providerId: number;
  name: string;
  groupId?: string;
  subGroupId?: string;
  categoryId?: string;
  image?: string;
  units: string;
  unitCost: number;
  holidayProvision: number;
  depositAmount: number;
  installment: number;
  totalOutstandingAmount?: number;
  paymentFreq: string;
  paymentMethod: string;
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

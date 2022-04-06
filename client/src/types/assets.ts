export interface AssetDB {
  id: string;
  asset_provider_id: string;
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
  deleted_at?: string;
}

export interface AssetTezos {
  id: string;
  providerId: string;
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
  totalOutStandingAmount?: number;
  paymentFreq: string;
  paymentMethod: string;
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

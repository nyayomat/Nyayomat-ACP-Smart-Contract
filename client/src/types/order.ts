export interface OrdersDB {
  id: string;
  merchant_id: string;
  asset_provider_id: string;
  asset_id: string;
  units: number;
  unit_cost: number;
  holiday_provision: number;
  deposit_amount: number;
  installment: number;
  installment_amount: number;
  total_out_standing_amount: number;
  payment_frequency: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrdersTezos {
  id: string;
  merchantId: string;
  assetProviderId: string;
  assetId: string;
  units: string;
  unitCost: string;
  holidayProvision: string;
  depositAmount: string;
  installment: string;
  installmentAmount: string;
  totalOutStandingAmount: string;
  paymentFreq: string;
  paymentMethod: string;
  status: string;
  orderBy: string;
  createdAt: string;
  updatedAt: string;
}

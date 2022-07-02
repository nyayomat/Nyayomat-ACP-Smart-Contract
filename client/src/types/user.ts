export interface UserDB {
  id: string;
  shop_id?: number;
  role?: string;
  role_id: string;
  onChainId?: string;
  description: string;
  active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface UserTezos {
  id: string;
  shopId?: string;
  onChainId?: string;
  role?: string;
  roleId: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

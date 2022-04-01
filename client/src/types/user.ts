export interface UserDB {
  id: string;
  name: string;
  shop_id?: string;
  role?: string;
  role_id: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface UserTezos {
  id: string;
  name?: string;
  shopId?: string;
  role?: string;
  roleId: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

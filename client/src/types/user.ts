export interface UserDB {
  id: string;
  name: string;
  access?: string;
  description: string;
  point?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface UserTezos {
  id: string;
  name: string;
  access?: string;
  description: string;
  point?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

let is_owner = (()): bool => {
  Tezos.sender == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" : address)
};

type id = string;

type asset = {
  id,
  providerId: id,
  name: string,
  groupId: id,
  subGroupId: id,
  categoryId: id,
  image: string,
  units: string,
  unitCost: int,
  holidayProvision: int,
  depositAmount: int,
  installment: int,
  totalOutStandingAmount: int,
  paymentFreq: string,
  paymentMethod: string,
  status: string,
  owner: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string
};

type storage = big_map(id, asset);

type return = (list(operation), storage);

let createAsset = (asset: asset, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  let storage: storage = 
    Big_map.add(asset.id, asset, storage);
  (([] : list(operation)), storage)
};

let updateAsset = (asset: asset, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update asset details")
  };
  let (_old_storage, storage) = 
    Big_map.get_and_update(asset.id, Some (asset), storage);
  (([] : list(operation)), storage)
};

let removeAsset = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update asset")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getAsset = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(asset) => Big_map.literal([(id, asset)])
    | None => (failwith("Asset not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getAssets = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateAsset(asset)
| UpdateAsset(asset)
| RemoveAsset(id)
| GetAsset(id)
| GetAssets;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateAsset(asset) => createAsset((asset, storage))
   | UpdateAsset(asset) => updateAsset((asset, storage))
   | RemoveAsset(id) => removeAsset((id, storage))
   | GetAsset(id) => getAsset((id, storage))
   | GetAssets => getAssets(storage)
   })
};

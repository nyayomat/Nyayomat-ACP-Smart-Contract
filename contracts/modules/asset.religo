let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type asset = {
  id: string,
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
  deletedAt: string};

type storage = big_map(id, asset);

type return = (list(operation), storage);

type parameter = Create(list(asset)) | Update(list(asset)) | Remove(id);

let create = (assets: list(asset), storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  let _add = (asset: asset): unit => {
    let _ = Big_map.add(asset.id, asset, storage);
    ()
  };
   List.iter(_add, assets);
  storage
};

let update = (assets: list(asset), storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update asset details")
  };
    let _update = (asset: asset): unit => {
 let _ = Big_map.update(asset.id, Some (asset), storage);
      ()
    };
     List.iter(_update, assets);
  storage
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update asset")
  };
  Big_map.remove(id, storage)
};

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (([] : list(operation)),
    (switch (action) {
     | Create(asset) => create((asset, storage))
     | Update(asset) => update((asset, storage))
     | Remove(id) => remove((id, storage))
     }))
};

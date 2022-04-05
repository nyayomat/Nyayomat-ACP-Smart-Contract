let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type provider = {
  id: string,
  operatingDays: string,
  status: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string};

type storage = big_map(id, provider);

type return = (list(operation), storage);

let create = (provider: provider, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new provider")
  };
  Big_map.add(provider.id, provider, storage)
};

let update = (provider: provider, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update provider details")
  };
  Big_map.update(provider.id, Some (provider), storage)
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can remove provider")
  };
  Big_map.remove(id, storage)
};

type parameter = 
  CreateProvider(provider)
| UpdateProvider(provider)
| RemoveProvider(id);

let main = ((action, storage): (parameter, storage)): return => {
  (([] : list(operation)),
    (switch (action) {
     | CreateProvider(params) => create((params, storage))
     | UpdateProvider(params) => update((params, storage))
     | RemoveProvider(id) => remove((id, storage))
     }))
};

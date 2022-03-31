let is_owner = (()): bool => {
  Tezos.sender == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" : address)
};

type status = Approved | Declined | Shortlisted | Pending;

type id = string;

type provider = {
  id,
  name: string,
  shopName: string,
  address: option(address),
  operatingDays: string,
  status,
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt: option(timestamp)};

type storage = big_map(id, provider);

type return = (list(operation), storage);

let createProvider = (provider: provider, storage: storage)
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new provider")
  };
  let storage: storage = 
    Big_map.add(provider.id, provider, storage);
  (([] : list(operation)), storage)
};

let updateProvider = (provider: provider, storage: storage)
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update provider details")
  };
  let (_old_storage, storage) = 

    Big_map.get_and_update(provider.id,
       Some (provider),
       storage);
  (([] : list(operation)), storage)
};

let removeProvider = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update provider")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getProvider = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(provider) => Big_map.literal([(id, provider)])
    | None => (failwith("Provider not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getProviders = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateProvider(provider)
| UpdateProvider(provider)
| RemoveProvider(id)
| GetProvider(id)
| GetProviders;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateProvider(provider) =>
       createProvider((provider, storage))
   | UpdateProvider(provider) =>
       updateProvider((provider, storage))
   | RemoveProvider(id) => removeProvider((id, storage))
   | GetProvider(id) => getProvider((id, storage))
   | GetProviders => getProviders(storage)
   })
};

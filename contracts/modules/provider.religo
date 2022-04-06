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

type parameter = 
  Create(list(provider))
| Update(list(provider))
| Remove(id);

let create = (providers: list(provider), storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new provider")
  };

  let _add = (provider: provider): unit => {
    let _ = Big_map.add(provider.id, provider, storage);
    ()
  };
  List.iter(_add, providers);
  storage
};


let update = (providers: list(provider), storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update provider details")
  };
    let _update = (provider: provider): unit => {
      let _ = Big_map.update(provider.id, Some (provider), storage);
      ()
    };

   List.iter(_update, providers);
  storage
  
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can remove provider")
  };
  Big_map.remove(id, storage)
};

let main = ((action, storage): (parameter, storage)): return => {
  (([] : list(operation)),
    (switch (action) {
     | Create(provider) => create((provider, storage))
     | Update(provider) => update((provider, storage))
     | Remove(id) => remove((id, storage))
     }))
};

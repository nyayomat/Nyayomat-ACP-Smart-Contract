let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type user = {
  id: string,
  onChainId: string,
  shopId: id,
  role: string,
  description: string,
  roleId: string,
  active: bool,
  createdAt: string,
  updatedAt: string,
  deletedAt: string};

type storage = big_map(string, user);

type return = (list(operation), storage);

type parameter = 
  Create(list(user))
| Update(list(user))
| Remove(id);

let create = (users: list(user), storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only Admin can create user")
  };
  let _add = (user: user): unit => {
    let _ = Big_map.add(user.id, user, storage);
    ()
  };
  List.iter(_add, users);
  storage
};

let userExists = ((id, storage): (id, storage)): bool => {
  switch (Big_map.find_opt(id, storage)) {
  | Some(_user) => true
  | None => false
  }
};

let update = (users: list(user), storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only Admin can update user details")
  };
  let _update = (user: user): unit => {
    let _ = Big_map.update(user.id, Some (user), storage);
    ()
  };
  List.iter(_update, users);
  storage
};

let remove = ((id, storage): (id, storage)): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only Admin can remove user")
  };
  Big_map.remove(id, storage)
};

let main = ((action, storage): (parameter, storage)): return => {
  (([] : list(operation)),
    (switch (action) {
     | Create(user) => create(user, storage)
     | Update(user) => update((user, storage))
     | Remove(id) => remove((id, storage))
     }))
};

let is_owner = (()): bool => {
  Tezos.sender == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" : address)
};

type userType = Admin | Merchant;

type user = {
  id: address,
  name: string,
  shopId: option(nat),
  role: userType,
  description: string,
  point: option(nat),
  createdAt: string,
  updatedAt: string,
  deletedAt: string
};

type user_storage = big_map(address, user);

let init_user_storage: user_storage = Big_map.empty;

type userId = address;

type return = (list(operation), user_storage);

type parameter = 
  CreateUser(user)
| GetUser(userId)
| GetUsers
| RemoveUser(userId)
| UpdateUser(user);

let createUser = ((user, user_storage): (user, user_storage))
: return => {
  if(is_owner()) {


    failwith("Only the s.c owner can create a new user record")
  };
  let user_storage = 
    Big_map.add(user.id, user, user_storage);
  (([] : list(operation)), user_storage)
};

let getUser = ((userId, user_storage): (userId, user_storage))
: return => {
  let user: user_storage = 
    switch (Big_map.find_opt(userId, user_storage)) {
    | Some(user) => Big_map.literal([(userId, user)])
    | None => (failwith("user not found") : user_storage)
    };
  (([] : list(operation)), user)
};

let getUsers = 
  ((storage: user_storage): return => {
     (([] : list(operation), storage))
   });

let userExists = ((userId, user_storage): (userId,
   user_storage)): bool => {
  switch (Big_map.find_opt(userId, user_storage)) {
  | Some(_user) => true
  | None => false
  }
};

let updateUser = ((user, storage): (user, user_storage))
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only Admin can update user details")
  };
  let (_, user_storage) = 
    Big_map.get_and_update(user.id, Some (user), storage);
  (([] : list(operation)), user_storage)
};

let removeUser = ((userId, user_storage): (userId,
   user_storage)): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only Admin can update user details")
  };
  let some_user: user_storage = 
    switch (Big_map.find_opt(userId, user_storage)) {
    | Some(_) => user_storage
    | None =>
        (failwith("user doesn't exist") : user_storage)
    };
  let user_storage = Big_map.remove(userId, some_user);
  (([] : list(operation)), user_storage)
};

let main = ((action, storage): (parameter, user_storage))
: return => {
  (switch (action) {
   | CreateUser(user) => createUser(user, storage)
   | GetUser(userId) => getUser((userId, storage))
   | GetUsers => getUsers(storage)
   | RemoveUser(userId) => removeUser((userId, storage))
   | UpdateUser(user) => updateUser((user, storage))
   })
};

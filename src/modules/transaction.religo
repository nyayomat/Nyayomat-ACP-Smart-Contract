let is_admin = (user: address): bool => {
  user == ("tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" : address)
};

type id = string;

type tx = {
  id: string,
  assetProviderId: id,
  merchantId: id,
  orderId: id,
  assetId: id,
  dueDate: string,
  paidOn: string,
  txType: string,
  initiator: string,
  amount: int,
  createdAt: string,
  updatedAt: string};

type storage = big_map(id, tx);

type return = (list(operation), storage);

type parameter = Create(tx) | Update(tx) | Remove(id);

let create = ((tx, storage): (tx, storage)): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  Big_map.add(tx.id, tx, storage)
};

let update = (tx: tx, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update tx details")
  };
  Big_map.update(tx.id, Some (tx), storage)
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update tx")
  };
  Big_map.remove(id, storage)
};

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (([] : list(operation)),
    (switch (action) {
     | Create(tx) => create((tx, storage))
     | Update(tx) => update((tx, storage))
     | Remove(id) => remove((id, storage))
     }))
};

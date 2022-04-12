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
  owner: string,
  amount: string,
  table: string,
  createdAt: string,
  updatedAt: string};

type storage = big_map(id, tx);

type return = (list(operation), storage);

type parameter = 
  Create(list(tx))
| Update(list(tx))
| Remove(id);

let create = ((txs, storage): (list(tx), storage)): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  let _add = (tx: tx): unit => {
    let _ = Big_map.add(tx.id, tx, storage);
    ()
  };
  List.iter(_add, txs);
  storage
};

let update = (txs: list(tx), storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update tx details")
  };
  let _update = (tx: tx): unit => {
    let _ = Big_map.update(tx.id, Some (tx), storage);
    ()
  };
  List.iter(_update, txs);
  storage
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

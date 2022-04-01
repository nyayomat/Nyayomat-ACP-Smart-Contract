let is_owner = (()): bool => {
  Tezos.sender == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" : address)
};

type id = string;

type txType = Deposit | Installment;

type txInitiator = Merchant | Provider;

type tx = {
  id,
  assetProviderId: option(id),
  merchantId: option(id),
  orderId: option(id),
  assetId: id,
  dueDate: timestamp,
  paidOn: timestamp,
  txType,
  initiator: txInitiator,
  amount: nat,
  createdAt: timestamp,
  updatedAt: timestamp
};

type storage = big_map(id, tx);

type return = (list(operation), storage);

let createTransaction = ((tx, storage): (tx, storage))
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  let storage: storage = Big_map.add(tx.id, tx, storage);
  (([] : list(operation)), storage)
};

let updateTransaction = (tx: tx, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update tx details")
  };
  let (_old_storage, storage) = 
    Big_map.get_and_update(tx.id, Some (tx), storage);
  (([] : list(operation)), storage)
};

let removeTransaction = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update tx")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getTransaction = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(tx) => Big_map.literal([(id, tx)])
    | None => (failwith("tx not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getTransactions = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateTransaction(tx)
| UpdateTransaction(tx)
| RemoveTransaction(id)
| GetTransaction(id)
| GetTransactions;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateTransaction(tx) =>
       createTransaction((tx, storage))
   | UpdateTransaction(tx) =>
       updateTransaction((tx, storage))
   | RemoveTransaction(id) =>
       removeTransaction((id, storage))
   | GetTransaction(id) => getTransaction((id, storage))
   | GetTransactions => getTransactions(storage)
   })
};

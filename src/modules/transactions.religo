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

type transaction = {
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

type storage = big_map(id, transaction);

type return = (list(operation), storage);

let createTransaction = ((transaction, storage): (transaction,
   storage)): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  let storage: storage = 
    Big_map.add(transaction.id, transaction, storage);
  (([] : list(operation)), storage)
};

let updateTransaction = (transaction: transaction,
   storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update transaction details")
  };
  let (_old_storage, storage) = 

    Big_map.get_and_update(transaction.id,
       Some (transaction),
       storage);
  (([] : list(operation)), storage)
};

let removeTransaction = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update transaction")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getTransaction = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(transaction) =>
        Big_map.literal([(id, transaction)])
    | None => (failwith("transaction not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getTransactions = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateTransaction(transaction)
| UpdateTransaction(transaction)
| RemoveTransaction(id)
| GetTransaction(id)
| GetTransactions;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateTransaction(transaction) =>
       createTransaction((transaction, storage))
   | UpdateTransaction(transaction) =>
       updateTransaction((transaction, storage))
   | RemoveTransaction(id) =>
       removeTransaction((id, storage))
   | GetTransaction(id) => getTransaction((id, storage))
   | GetTransactions => getTransactions(storage)
   })
};

let is_owner = (()): bool => {
  Tezos.sender == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type txType = Deposit | Installment;

type txInitiator = Merchant | Provider;

type status = Approved | Declined | Shortlisted | Pending;

type order = {
  id,
  assetProviderId: id,
  merchantId: id,
  assetId: id,
  units: int,
  unitCost: int,
  holidayProvision: int,
  depositAmount: int,
  installmentAmount: int,
  totalOutStandingAmount: int,
  paymentFreq: string,
  paymentMethod: string,
  status: string,
  createdAt: string,
  updatedAt: string};

type storage = big_map(id, order);

type return = (list(operation), storage);

let createOrder = ((order, storage): (order, storage))
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  let storage: storage = 
    Big_map.add(order.id, order, storage);
  (([] : list(operation)), storage)
};

let updateOrder = (order: order, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update order details")
  };
  let (_old_storage, storage) = 
    Big_map.get_and_update(order.id, Some (order), storage);
  (([] : list(operation)), storage)
};

let removeOrder = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update order")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getOrder = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(order) => Big_map.literal([(id, order)])
    | None => (failwith("order not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getOrders = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateOrder(order)
| UpdateOrder(order)
| RemoveOrder(id)
| GetOrder(id)
| GetOrders;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateOrder(order) => createOrder((order, storage))
   | UpdateOrder(order) => updateOrder((order, storage))
   | RemoveOrder(id) => removeOrder((id, storage))
   | GetOrder(id) => getOrder((id, storage))
   | GetOrders => getOrders(storage)
   })
};

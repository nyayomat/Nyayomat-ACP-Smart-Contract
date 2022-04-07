let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type order = {
  id: string,
  assetProviderId: id,
  merchantId: id,
  assetId: id,
  units: string,
  unitCost: string,
  holidayProvision: string,
  depositAmount: string,
  installment: string,
  installmentAmount: string,
  totalOutStandingAmount: string,
  paymentFreq: string,
  paymentMethod: string,
  status: string,
  createdAt: string,
  updatedAt: string};

type storage = big_map(id, order);

type return = (list(operation), storage);

let create = ((orders, storage): (list(order), storage))
: storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new asset")
  };
  let _add = (order: order): unit => {
    let _ = Big_map.add(order.id, order, storage);
    ()
  };
  List.iter(_add, orders);
  storage
};

let update = (orders: list(order), storage: storage)
: storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update order details")
  };
  let _update = (order: order): unit => {
    let _ = Big_map.update(order.id, Some (order), storage);
    ()
  };
  List.iter(_update, orders);
  storage
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update order")
  };
  Big_map.remove(id, storage)
};

type parameter = 
  Create(list(order))
| Update(list(order))
| Remove(id);

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (([] : list(operation)),
    (switch (action) {
     | Create(order) => create((order, storage))
     | Update(order) => update((order, storage))
     | Remove(id) => remove((id, storage))
     }))
};

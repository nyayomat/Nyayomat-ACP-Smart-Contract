let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type invoice = {
  id: string,
  userId: id,
  shopId: id,
  providerId: id,
  total: int,
  tax: int,
  createdAt: string,
  updatedAt: string,
  deletedAt: string};

type storage = big_map(id, invoice);

type return = (list(operation), storage);

type parameter = 
  Create(invoice)
| Update(invoice)
| Remove(id);

let create = (invoice: invoice, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new invoice")
  };
  Big_map.add(invoice.id, invoice, storage)
};

let update = (invoice: invoice, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update invoice details")
  };
  Big_map.update(invoice.id, Some (invoice), storage)
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update invoice")
  };
  Big_map.remove(id, storage)
};

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (([] : list(operation)),
    (switch (action) {
     | Create(invoice) => create((invoice, storage))
     | Update(invoice) => update((invoice, storage))
     | Remove(id) => remove((id, storage))
     }))
};

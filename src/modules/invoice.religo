let is_owner = (()): bool => {
  Tezos.sender == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type invoice = {
  id,
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

let createInvoice = (invoice: invoice, storage: storage)
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new invoice")
  };
  let storage: storage = 
    Big_map.add(invoice.id, invoice, storage);
  (([] : list(operation)), storage)
};

let updateInvoice = (invoice: invoice, storage: storage)
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update invoice details")
  };
  let (_old_storage, storage) = 

    Big_map.get_and_update(invoice.id,
       Some (invoice),
       storage);
  (([] : list(operation)), storage)
};

let removeInvoice = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update invoice")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getInvoice = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(invoice) => Big_map.literal([(id, invoice)])
    | None => (failwith("Invoice not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getInvoices = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateInvoice(invoice)
| UpdateInvoice(invoice)
| RemoveInvoice(id)
| GetInvoice(id)
| GetInvoices;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateInvoice(invoice) =>
       createInvoice((invoice, storage))
   | UpdateInvoice(invoice) =>
       updateInvoice((invoice, storage))
   | RemoveInvoice(id) => removeInvoice((id, storage))
   | GetInvoice(id) => getInvoice((id, storage))
   | GetInvoices => getInvoices(storage)
   })
};

let is_owner = (()): bool => {
  Tezos.sender == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" : address)
};

type id = string;

type inventory = {
  id,
  shopId: id,
  title: string,
  warehouseId: option(id),
  productId: id,
  sku: string,
  condition: option(string),
  conditionNote: option(string),
  description: option(string),
  keyFeatures: option(string),
  stockQuantity: nat,
  damagedQauntity: option(nat),
  userId: id,
  purchasePrice: option(nat),
  salePrice: nat,
  offerPrice: option(nat),
  offerStartDate: option(timestamp),
  offerEndDate: option(timestamp),
  shippingWeight: option(nat),
  freeShipping: option(bool),
  availableFrom: option(timestamp),
  minOrderQuantity: option(nat),
  slug: string,
  linkedItems: option(list(id)),
  metaTitle: option(string),
  metaDescription: option(string),
  stuffPick: option(string),
  active: bool,
  customerPointsDiscountPercentage: option(nat),
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt: option(timestamp)};

type storage = big_map(id, inventory);

type return = (list(operation), storage);

let createInventory = (inventory: inventory,
   storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new inventory")
  };
  let storage: storage = 
    Big_map.add(inventory.id, inventory, storage);
  (([] : list(operation)), storage)
};

let updateInventory = (inventory: inventory,
   storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update inventory details")
  };
  let (_old_storage, storage) = 

    Big_map.get_and_update(inventory.id,
       Some (inventory),
       storage);
  (([] : list(operation)), storage)
};

let removeInventory = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update inventory")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getInventory = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(inventory) => Big_map.literal([(id, inventory)])
    | None => (failwith("Inventory not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getInventorys = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateInventory(inventory)
| UpdateInventory(inventory)
| RemoveInventory(id)
| GetInventory(id)
| GetInventorys;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateInventory(inventory) =>
       createInventory((inventory, storage))
   | UpdateInventory(inventory) =>
       updateInventory((inventory, storage))
   | RemoveInventory(id) => removeInventory((id, storage))
   | GetInventory(id) => getInventory((id, storage))
   | GetInventorys => getInventorys(storage)
   })
};

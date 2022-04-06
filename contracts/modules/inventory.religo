let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type inventory = {
  id: string,
  shopId: id,
  title: string,
  warehouseId: id,
  productId: id,
  sku: string,
  condition: string,
  conditionNote: string,
  description: string,
  keyFeatures: string,
  stockQuantity: int,
  damagedQauntity: int,
  userId: id,
  purchasePrice: int,
  salePrice: int,
  offerPrice: int,
  offerStartDate: string,
  offerEndDate: string,
  shippingWeight: int,
  freeShipping: bool,
  availableFrom: string,
  minOrderQuantity: int,
  slug: string,
  linkedItems: string,
  metaTitle: string,
  metaDescription: string,
  stuffPick: string,
  active: bool,
  customerPointsDiscountPercentage: int,
  createdAt: string,
  updatedAt: string,
  deletedAt: string};

type storage = big_map(id, inventory);

type return = (list(operation), storage);

let create = (inventory: inventory, storage: storage)
: storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new inventory")
  };
  Big_map.add(inventory.id, inventory, storage)
};

let update = (inventory: inventory, storage: storage)
: storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update inventory details")
  };
  Big_map.update(inventory.id, Some (inventory), storage)
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update inventory")
  };
  Big_map.remove(id, storage)
};

type parameter = 
  Create(inventory)
| Update(inventory)
| Remove(id);

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (([] : list(operation)),
    (switch (action) {
     | Create(inventory) => create((inventory, storage))
     | Update(inventory) => update((inventory, storage))
     | Remove(id) => remove((id, storage))
     }))
};

let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type product = {
  id: string,
  shopId: id,
  manufacturerId: string,
  brand: string,
  name: string,
  modelNumber: string,
  mpn: string,
  gtin: string,
  gtinType: string,
  description: string,
  minPrice: int,
  maxPrice: int,
  originCountry: string,
  hasVariant: bool,
  requiresShipping: bool,
  downloadable: string,
  slug: string,
  salesCount: int,
  active: bool,
  createdAt: string,
  updatedAt: string,
  deletedAt: string
};

type storage = big_map(id, product);

type return = (list(operation), storage);

type parameter = 
  Create(product)
| Update(product)
| Remove(id);

let create = (products: product, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new product")
  };
  let _add = (product: product): unit => {
    let _ = Big_map.add(product.id, product, storage);
    ()
  };
  List.iter(_add, products);
  storage
};

let update = (products: product, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update product details")
  };
  let _update = (product: product): unit => {
    let _ = 
      Big_map.update(product.id, Some (product), storage);
    ()
  };
  List.iter(_update, products);
  storage
};

let remove = (id: id, storage: storage): storage => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update product")
  };
  Big_map.remove(id, storage)
};

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (([] : list(operation)),
    (switch (action) {
     | Create(product) => create((product, storage))
     | Update(product) => update((product, storage))
     | Remove(id) => remove((id, storage))
     }))
};

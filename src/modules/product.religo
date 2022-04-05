let is_owner = (()): bool => {
  Tezos.sender == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

type id = string;

type product = {
  id,
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
  deletedAt: string};

type storage = big_map(id, product);

type return = (list(operation), storage);

let createProduct = (product: product, storage: storage)
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only an admin can create a new product")
  };
  let storage: storage = 
    Big_map.add(product.id, product, storage);
  (([] : list(operation)), storage)
};

let updateProduct = (product: product, storage: storage)
: return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update product details")
  };
  let (_old_storage, storage) = 

    Big_map.get_and_update(product.id,
       Some (product),
       storage);
  (([] : list(operation)), storage)
};

let removeProduct = (id: id, storage: storage): return => {
  if(! is_admin(Tezos.sender)) {
    failwith("Only admin can update product")
  };
  (([] : list(operation)), Big_map.remove(id, storage))
};

let getProduct = (id: id, storage: storage): return => {
  let storage: storage = 
    switch (Big_map.find_opt(id, storage)) {
    | Some(product) => Big_map.literal([(id, product)])
    | None => (failwith("Product not found") : storage)
    };
  (([] : list(operation)), storage)
};

let getProducts = (storage: storage): return => {
  (([] : list(operation)), storage)
};

type parameter = 
  CreateProduct(product)
| UpdateProduct(product)
| RemoveProduct(id)
| GetProduct(id)
| GetProducts;

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
  (switch (action) {
   | CreateProduct(product) =>
       createProduct((product, storage))
   | UpdateProduct(product) =>
       updateProduct((product, storage))
   | RemoveProduct(id) => removeProduct((id, storage))
   | GetProduct(id) => getProduct((id, storage))
   | GetProducts => getProducts(storage)
   })
};

#include "../utils/common.religo"

type id = string;

type product = {
    id,
    shopId: id,
    manufacturerId: option(string),
    brand: option(string),
    name: string,
    modelNumber: option(string),
    mpn: option(string),
    gtin: option(string),
    gtinType: option(string),
    description: option(string),
    minPrice: nat,
    maxPrice: nat,
    originCountry: string,
    hasVariant: bool,
    requiresShipping: bool,
    downloadable: option(string),
    slug: string,
    salesCount: nat,
    active: bool,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: option(timestamp)
};

type storage = big_map(id, product);

type return = (list(operation), storage);

/// @dev Create a new product
/// Only an existing admin can create a new product.
/// @param product
/// @returns return
let createProduct = (product: product, storage: storage)
: return => {

    if(! is_admin(Tezos.sender)) {
        failwith("Only an admin can create a new product")
    };

    let storage: storage = 
        Big_map.add(product.id, product, storage);

    (([] : list(operation)), storage)
    };


/// @dev Updates an exisiting product record
/// It's only the admin who can update a product.
/// @param product The new product data
let updateProduct = (product: product, storage: storage): return => {

    /* Ensure that the user updating the product is product */
   if(! is_admin(Tezos.sender)) {
       failwith("Only admin can update product details");
   };

    /* Update the product in the storage */
    let (_old_storage, storage) = Big_map.get_and_update(product.id, Some(product), storage);

    (([]: list(operation)), storage)

}


/// @dev Deletes an existing product record
/// It's only the admin who can delete a product.
/// @param id The id of the product to delete
let removeProduct = (id: id, storage: storage): return => {

     /* Ensure that the user deleting the product is admin */
   if(!is_admin(Tezos.sender)) {
       failwith("Only admin can update product");
   };

    /* Remove the product from the storage */
     (([]: list(operation)), Big_map.remove(id, storage))
}


let getProduct = (id: id, storage: storage): return => {

    /* Get the product from the storage */

    let storage: storage = 
        switch(Big_map.find_opt(id, storage)){
            | Some(product)=>
                Big_map.literal([(id, product)]);
            | None =>
                (failwith("Product not found"): storage)
        };

    (([]: list(operation)), storage)
}

let getProducts = (storage: storage): return => {

    (([]: list(operation)), storage)
}


type parameter = 
CreateProduct (product) 
| UpdateProduct (product)
| RemoveProduct (id)
| GetProduct (id)
| GetProducts

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
 (switch (action) {
  | CreateProduct (product) => createProduct ((product, storage))
  | UpdateProduct (product) => updateProduct ((product, storage))
  | RemoveProduct (id) => removeProduct ((id, storage))
  | GetProduct   (id) => getProduct ((id, storage))
  | GetProducts     => getProducts(storage)
  
  })
};

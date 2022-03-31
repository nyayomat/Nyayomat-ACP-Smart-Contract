#include "../utils/common.religo"

type status = Approved | Declined | Shortlisted | Pending;

type id = string;

type provider = {
    id,
    name: string,
    shopName: string,
    address: option(address),
    operatingDays: string,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: option(timestamp)
};

type storage = big_map(id, provider);

type return = (list(operation), storage);

/// @dev Create a new provider
/// Only an existing admin can create a new provider
/// @param provider
/// @returns return
let createProvider = (provider: provider, storage: storage)
: return => {

    if(! is_admin(Tezos.sender)) {
        failwith("Only an admin can create a new provider")
    };

    let storage: storage = 
        Big_map.add(provider.id, provider, storage);

    (([] : list(operation)), storage)
    };


/// @dev Updates an exisiting provider record
/// It's only the admin who can update a provider.
/// @param provider The new provider data
let updateProvider = (provider: provider, storage: storage): return => {

    /* Ensure that the user updating the provider is provider */
   if(! is_admin(Tezos.sender)) {
       failwith("Only admin can update provider details");
   };

    /* Update the provider in the storage */
    let (_old_storage, storage) = Big_map.get_and_update(provider.id, Some(provider), storage);

    (([]: list(operation)), storage)

}


/// @dev Deletes an existing provider record
/// It's only the admin who can delete a provider.
/// @param id The id of the provider to delete
let removeProvider = (id: id, storage: storage): return => {

     /* Ensure that the user deleting the provider is admin */
   if(!is_admin(Tezos.sender)) {
       failwith("Only admin can update provider");
   };

    /* Remove the provider from the storage */
     (([]: list(operation)), Big_map.remove(id, storage))
}


let getProvider = (id: id, storage: storage): return => {

    /* Get the provider from the storage */

    let storage: storage = 
        switch(Big_map.find_opt(id, storage)){
            | Some(provider)=>
                Big_map.literal([(id, provider)]);
            | None =>
                (failwith("Provider not found"): storage)
        };

    (([]: list(operation)), storage)
}

let getProviders = (storage: storage): return => {

    (([]: list(operation)), storage)
}


type parameter = 
CreateProvider (provider) 
| UpdateProvider (provider)
| RemoveProvider (id)
| GetProvider (id)
| GetProviders

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
 (switch (action) {
  | CreateProvider (provider) => createProvider ((provider, storage))
  | UpdateProvider (provider) => updateProvider ((provider, storage))
  | RemoveProvider (id) => removeProvider ((id, storage))
  | GetProvider   (id) => getProvider ((id, storage))
  | GetProviders     => getProviders(storage)
  
  })
};

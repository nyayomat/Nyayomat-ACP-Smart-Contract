#include "./admin.religo"
#include "../types/provider.religo"

type provider_storage = big_map(string, provider);

let init_storage: provider_storage = Big_map.empty;

type providerId = string;

type return =  (list(operation), provider_storage);

/// @dev Add a new provider. 
/// It's only the admin who can add a new provider.
/// @param provider_ The provider to add
/// @return The provider added
let create_provider = ((providerId, provider_): (providerId, provider)): return => {

 /* Ensure that the user updating the provider is provider */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can add a new provider");
   };

    /* Insert the provider into the storage */

    let provider_storage = Big_map.add(providerId, provider_  , init_storage);

    (([]: list(operation)), provider_storage)
}

/// @dev Updates an exisiting provider record
/// It's only the admin who can update a provider.
/// @param providerId The id of the provider to update
/// @param provider The new provider data
let update_provider = ((providerId, provider): (providerId, provider)): return => {

    /* Ensure that the user updating the provider is provider */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can update provider");
   };

    /* Update the provider in the storage */
    let (_, new_provider_storage) = Big_map.get_and_update(providerId, Some(provider), init_storage);

    (([]: list(operation)), new_provider_storage)

}

/// @dev Deletes an exisiting provider record
/// It's only the admin who can delete a provider.
/// @param providerId The id of the provider to delete
let remove_provider = ((providerId): (providerId)): return => {

     /* Ensure that the user deleting the provider is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can update provider");
   };

    /* Remove the provider from the storage */
     (([]: list(operation)), Big_map.remove(providerId, init_storage))
}


/// @dev Gets a provider record
/// @param providerId The id of the provider to get
let get_provider = ((providerId): (providerId)): (list(operation), provider) => {

    /* Get the provider from the storage */

    let provider: provider = 
        switch(Big_map.find_opt(providerId, init_storage)){
            | Some(provider)=>
                provider
            | None =>
                (failwith("Provider not found"): provider)
        };

    (([]: list(operation)), provider)
}
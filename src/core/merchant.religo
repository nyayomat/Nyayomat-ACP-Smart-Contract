#include "../utils/common.religo"

type merchant = {
    id: address,
    name: string,
    created_at: string,
    updated_at: string
}
type merchant_storage = big_map(address, merchant);

let init_merchant_storage: merchant_storage = Big_map.empty;

type merchantId = address;

type return =  (list(operation), merchant_storage);

/// @dev Create a new merchant record
/// It's only the s.c owner who can create a new merchant record
/// @param merchantId The address of the merchant to create
let create_merchant = ((merchantId, merchant): (merchantId, merchant)): return => {

    // check if the caller is the s.c owner
   if(is_owner()) {
        failwith("Only the s.c owner can create a new merchant record");
   };

    /* Insert the merchant into the storage */

    let merchant_storage = Big_map.add(merchantId, merchant, init_merchant_storage);

    (([]: list(operation)), merchant_storage)
}

/// @dev Helper function to check whether merchant exists
/// @param merchantId The merchant's id to check
let merchant_exists = ((merchantId): (merchantId)): bool => {

    /* Check whether merchant exists */

    switch(Big_map.find_opt(merchantId, init_merchant_storage)){
        | Some(_merchant)=>
            true
        | None =>
            false
    }

}

/// @dev Update an merchant record
/// It's only possible to update merchant details by merchant
/// @param merchantId The merchant's id
/// @param merchant The merchant's new data
let update_merchant = ((merchantId, merchant): (merchantId, merchant)): return => {

    /* Ensure that the user updating the merchant is merchant */
   if(!merchant_exists(Tezos.sender)) {
       failwith("Only merchant can update merchant details");
   };


    /* Update the merchant in the storage */
    let (_, new_merchant_storage) = Big_map.get_and_update(merchantId, Some(merchant), init_merchant_storage);

    (([]: list(operation)), new_merchant_storage)

}

/// @dev Deletes an merchant record
/// It is only possible to delete an merchant if the sender is merchant
/// @param merchantId The id of the merchant to delete
let remove_merchant = ((merchantId): (merchantId)): return => {

 /* Ensure that the user deleting the merchant is merchant */
   if(!merchant_exists(Tezos.sender)) {
       failwith("Only merchant can remove merchant");
   };

    /* Remove the merchant from the storage */

    let merchant_storage = Big_map.remove(merchantId, init_merchant_storage);

    (([]: list(operation)), merchant_storage)
}


/// @dev Retrieves an merchant record
let get_merchant = ((merchantId): (merchantId)): (list(operation), merchant) => {

    /* Get the merchant from the storage */

    let merchant: merchant = 
        switch(Big_map.find_opt(merchantId, init_merchant_storage)){
            | Some(merchant)=>
                merchant
            | None =>
                (failwith("merchant not found"): merchant)
        };

    (([]: list(operation)), merchant)
}

/// @dev Retrieves all merchant records
let get_merchants = ((): return => {

  
    (([]: list(operation)), init_merchant_storage)
})
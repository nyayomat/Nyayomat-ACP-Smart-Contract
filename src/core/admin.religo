#include "../utils/common.religo"

type admin = {
    id: address,
    name: string,
    created_at: string,
    updated_at: string
}
type admin_storage = big_map(address, admin);

let init_storage: admin_storage = Big_map.empty;

type adminId = address;

type return =  (list(operation), admin_storage);

/// @dev Create a new admin record
/// It's only the s.c owner who can create a new admin record
/// @param adminId The address of the admin to create
let create_admin = ((adminId, admin): (adminId, admin)): return => {

    // check if the caller is the s.c owner
   if(is_owner()) {
        failwith("Only the s.c owner can create a new admin record");
   };

    /* Insert the admin into the storage */

    let admin_storage = Big_map.add(adminId, admin, init_storage);

    (([]: list(operation)), admin_storage)
}

/// @dev Helper function to check whether admin exists
/// @param adminId The admin's id to check
let admin_exists = ((adminId): (adminId)): bool => {

    /* Check whether admin exists */

    switch(Big_map.find_opt(adminId, init_storage)){
        | Some(_admin)=>
            true
        | None =>
            false
    }

}

/// @dev Update an admin record
/// It's only possible to update admin details by admin
/// @param adminId The admin's id
/// @param admin The admin's new data
let update_admin = ((adminId, admin): (adminId, admin)): return => {

    /* Ensure that the user updating the admin is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can update admin details");
   };


    /* Update the admin in the storage */
    let (_, new_admin_storage) = Big_map.get_and_update(adminId, Some(admin), init_storage);

    (([]: list(operation)), new_admin_storage)

}

/// @dev Deletes an admin record
/// It is only possible to delete an admin if the sender is admin
/// @param adminId The id of the admin to delete
let remove_admin = ((adminId): (adminId)): return => {

 /* Ensure that the user deleting the admin is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can remove admin");
   };

    /* Remove the admin from the storage */

    let admin_storage = Big_map.remove(adminId, init_storage);

    (([]: list(operation)), admin_storage)
}


/// @dev Retrieves an admin record
let get_admin = ((adminId): (adminId)): (list(operation), admin) => {

    /* Get the admin from the storage */

    let admin: admin = 
        switch(Big_map.find_opt(adminId, init_storage)){
            | Some(admin)=>
                admin
            | None =>
                (failwith("admin not found"): admin)
        };

    (([]: list(operation)), admin)
}

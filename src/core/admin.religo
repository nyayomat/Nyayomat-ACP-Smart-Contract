#include "../utils/common.religo"

type admin = {
    id: address,
    name: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
}
type admin_storage = big_map(address, admin);


let init_admin_storage: admin_storage = Big_map.empty;

type adminId = address;

type return =  (list(operation), admin_storage);

type parameter = 
    | CreateAdmin (admin)
    | GetAdmin (adminId)
    | GetAdmins 
    | RemoveAdmin (adminId)
    | UpdateAdmin (admin)


/// @dev Create a new admin record
/// It's only the s.c owner who can create a new admin record
/// @param adminId The address of the admin to create
let create_admin = ((admin, admin_storage): (admin, admin_storage)): return => {
    // check if the caller is the s.c owner
   if(is_owner()) {
        failwith("Only the s.c owner can create a new admin record");
   };

    /* Insert the admin into the storage */

  let admin_storage = Big_map.add(
      admin.id, admin, admin_storage);
      
  (([]: list(operation)), admin_storage)
};

/// @dev Retrieves an admin record
let get_admin = ((adminId, admin_storage): (adminId, admin_storage)): return => {

    /* Get the admin from the storage */
    let admin: admin_storage = 
        switch(Big_map.find_opt(adminId, admin_storage)){
            | Some (admin) =>
                Big_map.literal([(adminId, admin)]) 
            | None =>
                (failwith("admin not found"): admin_storage)
        };

    (([]: list(operation)), admin)
}

/// @dev Retrieves all admin records
let get_admins = ((storage: admin_storage): return => {
    (([]: list(operation), storage))
})


/// @dev Helper function to check whether admin exists
/// @param adminId The admin's id to check
let admin_exists = ((adminId, admin_storage): (adminId, admin_storage)): bool => {

    /* Check whether admin exists */

    switch(Big_map.find_opt(adminId, admin_storage)){
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
let update_admin = ((admin, storage): (admin, admin_storage)): return => {

    /* Ensure that the user updating the admin is admin */
   if(!admin_exists(Tezos.sender, storage)) {
       failwith("Only admin can update admin details");
   };


    /* Update the admin in the storage */
    let (_, admin_storage) = Big_map.get_and_update(admin.id, Some(admin), storage);

    (([]: list(operation)), admin_storage)

}

/// @dev Deletes an admin record
/// It is only possible to delete an admin if the sender is admin
/// @param adminId The id of the admin to delete
let remove_admin = ((adminId, admin_storage): (adminId, admin_storage)): return => {

 /* Ensure that the user deleting the admin is admin */
   if(!admin_exists(Tezos.sender, admin_storage)) {
       failwith("Only admin can remove admin");
   };

    
   let some_admin : admin_storage = 
        switch(Big_map.find_opt(adminId, admin_storage)){
        | Some(_)=>
            admin_storage
        | None =>
            (failwith("Admin doesn't exist"): admin_storage)
    };


    /* Remove the admin from the storage */
    let admin_storage = Big_map.remove(adminId, some_admin);

    (([]: list(operation)), admin_storage)
}



// @dev Entrypoint for the smart contract
let main = ((action, storage) : (parameter, admin_storage)) : return => {
    (switch(action) {
        | CreateAdmin (admin) => create_admin (admin, storage)
        | GetAdmin (adminId) => get_admin((adminId, storage))
        | GetAdmins => get_admins(storage)
        | RemoveAdmin (adminId) => remove_admin((adminId, storage))
        | UpdateAdmin (admin) => update_admin((admin, storage))
    })
}

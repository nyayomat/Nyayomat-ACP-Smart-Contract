#include "../utils/common.religo"

type admin = {
    id: address,
    name: string,
    created_at: string,
    updated_at: string
}
type admin_storage = big_map(address, admin);


let init_admin_storage: admin_storage = Big_map.empty;

type adminId = address;

type return =  (list(operation), admin_storage);

type parameter = 
    | Add_Admin (adminId)


/// @dev Create a new admin record
/// It's only the s.c owner who can create a new admin record
/// @param adminId The address of the admin to create
let create_admin = ((adminId, init_admin_storage): (adminId, admin_storage)): return => {
    let admin_kind: admin =
        {
            id: (adminId),
            name: "",
            created_at: "",
            updated_at: ""
        };
    // check if the caller is the s.c owner
   if(is_owner()) {
        failwith("Only the s.c owner can create a new admin record");
   };

    /* Insert the admin into the storage */

  let admin_storage = Big_map.add(
      adminId, admin_kind, init_admin_storage);
      
  (([]: list(operation)), admin_storage)
};

/// @dev Helper function to check whether admin exists
/// @param adminId The admin's id to check
let admin_exists = ((adminId): (adminId)): bool => {

    /* Check whether admin exists */

    switch(Big_map.find_opt(adminId, init_admin_storage)){
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
    let (_, new_admin_storage) = Big_map.get_and_update(adminId, Some(admin), init_admin_storage);

    (([]: list(operation)), new_admin_storage)

}

/// @dev Deletes an admin record
/// It is only possible to delete an admin if the sender is admin
/// @param adminId The id of the admin to delete
let remove_admin = ((adminId): (adminId)): admin_storage => {

 /* Ensure that the user deleting the admin is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can remove admin");
   };

   let _some_admin : admin = 
        switch(Big_map.find_opt(adminId, init_admin_storage)){
        | Some(_admin)=>
            _admin
        | None =>
            (failwith("Admin doesn't exist"))
    };

    /* Remove the admin from the storage */

    let admin_storage = Big_map.remove(adminId, init_admin_storage);

    (admin_storage)
}


/// @dev Retrieves an admin record
let get_admin = ((adminId): (adminId)): (list(operation), admin) => {

    /* Get the admin from the storage */

    let admin: admin = 
        switch(Big_map.find_opt(adminId, init_admin_storage)){
            | Some(admin)=>
                admin
            | None =>
                (failwith("admin not found"): admin)
        };

    (([]: list(operation)), admin)
}

/// @dev Retrieves all admin records
// let get_admins = ((): return => {

  
//     (([]: list(operation)))
// })

let main = ((action, init_admin_storage) : (parameter, admin_storage)) : return => {
    // (([] : list(operation)), init_admin_storage)
    (switch(action) {
        | Add_Admin (adminId) => create_admin((adminId, init_admin_storage))
    })
}

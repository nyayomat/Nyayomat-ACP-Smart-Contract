/// @dev This smart contract is used to manage inventories.
/// @dev The inventories are managed by the admin.
/// @dev The admin can create, update and delete records in inventory.

#include "../utils/common.religo"

type id = string;
type status = Approved | Declined | Shortlisted | Pending;
type inventoryOwner = Merchant | Provider;

type inventory = {
    id,
    providerId: id,
    name: string,
    groupId: option(id),
    subGroupId: option(id),
    categoryId: option(id),
    image: option(string),
    units: string,
    unit_cost: nat,
    holidayProvision: nat,
    depositAmount: nat,
    installment: nat,
    totalOutStandingAmount: option(nat),
    paymentFreq: string,
    paymentMethod: string,
    status: string,
    owner: option(inventoryOwner),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: option(timestamp)
};

type storage = big_map(id, inventory);

type return = (list(operation), storage);

/// @dev Create a new inventory
/// Only an existing admin can create a new inventory record
/// @param inventory
/// @returns return
let createInventory = (inventory: inventory, storage: storage)
: return => {

    if(! is_admin(Tezos.sender)) {
        failwith("Only an admin can create a new inventory")
    };

    let storage: storage = 
        Big_map.add(inventory.id, inventory, storage);

    (([] : list(operation)), storage)
    };


/// @dev Updates an exisiting inventory record
/// It's only the admin who can update a inventory.
/// @param inventory The new inventory data
let updateInventory = (inventory: inventory, storage: storage): return => {

    /* Ensure that the user updating the inventory is inventory */
   if(! is_admin(Tezos.sender)) {
       failwith("Only admin can update inventory details");
   };

    /* Update the inventory in the storage */
    let (_old_storage, storage) = Big_map.get_and_update(inventory.id, Some(inventory), storage);

    (([]: list(operation)), storage)

}


/// @dev Deletes an existing inventory record
/// It's only the admin who can delete a inventory.
/// @param id The id of the inventory to delete
let removeInventory = (id: id, storage: storage): return => {

     /* Ensure that the user deleting the inventory is admin */
   if(!is_admin(Tezos.sender)) {
       failwith("Only admin can update inventory");
   };

    /* Remove the inventory from the storage */
     (([]: list(operation)), Big_map.remove(id, storage))
}


let getInventory = (id: id, storage: storage): return => {

    /* Get the inventory from the storage */

    let storage: storage = 
        switch(Big_map.find_opt(id, storage)){
            | Some(inventory)=>
                Big_map.literal([(id, inventory)]);
            | None =>
                (failwith("Inventory not found"): storage)
        };

    (([]: list(operation)), storage)
}

let getInventorys = (storage: storage): return => {

    (([]: list(operation)), storage)
}


type parameter = 
CreateInventory (inventory) 
| UpdateInventory (inventory)
| RemoveInventory (id)
| GetInventory (id)
| GetInventorys

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
 (switch (action) {
  | CreateInventory (inventory) => createInventory ((inventory, storage))
  | UpdateInventory (inventory) => updateInventory ((inventory, storage))
  | RemoveInventory (id) => removeInventory ((id, storage))
  | GetInventory   (id) => getInventory ((id, storage))
  | GetInventorys     => getInventorys(storage)
  
  })
};

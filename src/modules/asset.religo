/// @notice tbl_acp_assets
/// @dev This smart contract is used to manage assets.
/// @dev The assets are managed by the admin.
/// @dev The admin can create, update and delete assets.

#include "../utils/common.religo"

type id = string;
type status = Approved | Declined | Shortlisted | Pending;
type status = Approved | Declined | Shortlisted | Pending;
type assetOwner = Merchant | Provider;

type asset = {
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
    owner: option(assetOwner),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: option(timestamp)
};

type storage = big_map(id, asset);

type return = (list(operation), storage);

/// @dev Create a new asset
/// Only an existing admin can create a new asset record
/// @param asset
/// @returns return
let createAsset = (asset: asset, storage: storage)
: return => {

    if(! is_admin(Tezos.sender)) {
        failwith("Only an admin can create a new asset")
    };

    let storage: storage = 
        Big_map.add(asset.id, asset, storage);

    (([] : list(operation)), storage)
    };


/// @dev Updates an exisiting asset record
/// It's only the admin who can update a asset.
/// @param asset The new asset data
let updateAsset = (asset: asset, storage: storage): return => {

    /* Ensure that the user updating the asset is asset */
   if(! is_admin(Tezos.sender)) {
       failwith("Only admin can update asset details");
   };

    /* Update the asset in the storage */
    let (_old_storage, storage) = Big_map.get_and_update(asset.id, Some(asset), storage);

    (([]: list(operation)), storage)

}


/// @dev Deletes an existing asset record
/// It's only the admin who can delete a asset.
/// @param id The id of the asset to delete
let removeAsset = (id: id, storage: storage): return => {

     /* Ensure that the user deleting the asset is admin */
   if(!is_admin(Tezos.sender)) {
       failwith("Only admin can update asset");
   };

    /* Remove the asset from the storage */
     (([]: list(operation)), Big_map.remove(id, storage))
}


let getAsset = (id: id, storage: storage): return => {

    /* Get the asset from the storage */

    let storage: storage = 
        switch(Big_map.find_opt(id, storage)){
            | Some(asset)=>
                Big_map.literal([(id, asset)]);
            | None =>
                (failwith("Asset not found"): storage)
        };

    (([]: list(operation)), storage)
}

let getAssets = (storage: storage): return => {

    (([]: list(operation)), storage)
}


type parameter = 
CreateAsset (asset) 
| UpdateAsset (asset)
| RemoveAsset (id)
| GetAsset (id)
| GetAssets

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
 (switch (action) {
  | CreateAsset (asset) => createAsset ((asset, storage))
  | UpdateAsset (asset) => updateAsset ((asset, storage))
  | RemoveAsset (id) => removeAsset ((id, storage))
  | GetAsset   (id) => getAsset ((id, storage))
  | GetAssets     => getAssets(storage)
  
  })
};

#include "./admin.religo"
#include "../types/listing.religo"

type listing_storage = big_map(string, listing);

let init_storage: listing_storage = Big_map.empty;

type listingId = string;

type return =  (list(operation), listing_storage);

let create_listing = ((listingId, listing): (listingId, listing)): return => {

    /* Ensure that the user creating the listing is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can create listing");
   };

    /* Insert the listing into the storage */

    let listing_storage = Big_map.add(listingId, listing, init_storage);

    (([]: list(operation)), listing_storage)
}


let get_listing = ((listingId): (listingId)): listing => {

    /* Get the listing from the storage */
        switch(Big_map.find_opt(listingId, init_storage)){
            | Some(listing)=>
                listing
            | None =>
                (failwith("listing not found"): listing)
        }

}

/**
* @param get listings
 * @returns {(list(operation), listing_storage)}
 */
let get_listings = ((filter): (option(listingType))): (list(operation), listing_storage) => {

    /* Get all listings from the storage */
    let listing_storage = switch (filter) {
        | Some(listingType) =>
            Big_map.filter(
                (listing: listing): bool => {
                    listing.listingType == listingType
                },
                init_storage
            )
        | None =>
            init_storage
    };

   
    (([]: list(operation)), listing_storage)

}



let update_listing = ((listingId, listing): (listingId, listing)): return => {

    /* Ensure that the user updating the listing is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can update listing");
   };


    /* Update the listing in the storage */
    let (_, new_listing_storage) = Big_map.get_and_update(listingId, Some(listing), init_storage);

    (([]: list(operation)), new_listing_storage)

}

let remove_listing = ((listingId, _): (listingId, listing_storage)): return => {

      if(!admin_exists(Tezos.sender)) {
          failwith("Only admin can remove listing");
      };

    /* Remove the listing from the storage */

    let listing_storage = Big_map.remove(listingId, init_storage);

    (([]: list(operation)), listing_storage)
}


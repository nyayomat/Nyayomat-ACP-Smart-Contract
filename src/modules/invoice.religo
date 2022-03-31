#include "../utils/common.religo"

type status = Approved | Declined | Shortlisted | Pending;

type id = string;

type invoice = {
    id,
    userId: id,
    shopId: id,
    providerId: id,
    total: int,
    tax: int,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: option(timestamp)
};

type storage = big_map(id, invoice);

type return = (list(operation), storage);

/// @dev Create a new invoice
/// Only an existing admin can create a new invoice
/// @param invoice
/// @returns return
let createInvoice = (invoice: invoice, storage: storage)
: return => {

    if(! is_admin(Tezos.sender)) {
        failwith("Only an admin can create a new invoice")
    };

    let storage: storage = 
        Big_map.add(invoice.id, invoice, storage);

    (([] : list(operation)), storage)
    };


/// @dev Updates an exisiting invoice record
/// It's only the admin who can update a invoice.
/// @param invoice The new invoice data
let updateInvoice = (invoice: invoice, storage: storage): return => {

    /* Ensure that the user updating the invoice is invoice */
   if(! is_admin(Tezos.sender)) {
       failwith("Only admin can update invoice details");
   };

    /* Update the invoice in the storage */
    let (_old_storage, storage) = Big_map.get_and_update(invoice.id, Some(invoice), storage);

    (([]: list(operation)), storage)

}


/// @dev Deletes an existing invoice record
/// It's only the admin who can delete a invoice.
/// @param id The id of the invoice to delete
let removeInvoice = (id: id, storage: storage): return => {

     /* Ensure that the user deleting the invoice is admin */
   if(!is_admin(Tezos.sender)) {
       failwith("Only admin can update invoice");
   };

    /* Remove the invoice from the storage */
     (([]: list(operation)), Big_map.remove(id, storage))
}


let getInvoice = (id: id, storage: storage): return => {

    /* Get the invoice from the storage */

    let storage: storage = 
        switch(Big_map.find_opt(id, storage)){
            | Some(invoice)=>
                Big_map.literal([(id, invoice)]);
            | None =>
                (failwith("Invoice not found"): storage)
        };

    (([]: list(operation)), storage)
}

let getInvoices = (storage: storage): return => {

    (([]: list(operation)), storage)
}


type parameter = 
CreateInvoice (invoice) 
| UpdateInvoice (invoice)
| RemoveInvoice (id)
| GetInvoice (id)
| GetInvoices

let main = ((action, storage): (parameter, storage))
: (list(operation), storage) => {
 (switch (action) {
  | CreateInvoice (invoice) => createInvoice ((invoice, storage))
  | UpdateInvoice (invoice) => updateInvoice ((invoice, storage))
  | RemoveInvoice (id) => removeInvoice ((id, storage))
  | GetInvoice   (id) => getInvoice ((id, storage))
  | GetInvoices     => getInvoices(storage)
  
  })
};

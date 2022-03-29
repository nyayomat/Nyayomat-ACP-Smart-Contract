#include "./admin.religo"
#include "../types/order.religo"

type order_storage = big_map(string, order);

let init_storage: order_storage = Big_map.empty;

type orderId = string;

type return =  (list(operation), order_storage);

let create_order = ((orderId, order): (orderId, order)): return => {

    /* Ensure that the user creating the order is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can create order");
   };

    /* Insert the order into the storage */

    let order_storage = Big_map.add(orderId, order, init_storage);

    (([]: list(operation)), order_storage)
}


let get_order = ((orderId): (orderId)): order => {

    /* Get the order from the storage */
        switch(Big_map.find_opt(orderId, init_storage)){
            | Some(order)=>
                order
            | None =>
                (failwith("order not found"): order)
        }

}

/**
* @param get orders
 * @returns {(list(operation), order_storage)}
 */
let get_orders = (()): (list(operation), order_storage) => {

    /* Get all orders from the storage */
    (([]: list(operation)), init_storage)

}



let update_order = ((orderId, order): (orderId, order)): return => {

    /* Ensure that the user updating the order is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can update order");
   };


    /* Update the order in the storage */
    let (_, new_order_storage) = Big_map.get_and_update(orderId, Some(order), init_storage);

    (([]: list(operation)), new_order_storage)

}

let remove_order = ((orderId, _): (orderId, order_storage)): return => {

      if(!admin_exists(Tezos.sender)) {
          failwith("Only admin can remove order");
      };

    /* Remove the order from the storage */

    let order_storage = Big_map.remove(orderId, init_storage);

    (([]: list(operation)), order_storage)
}


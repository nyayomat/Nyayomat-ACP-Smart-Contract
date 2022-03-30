#include "./admin.religo"
#include "../types/payment.religo"

type payment_storage = big_map(string, payment);

let init_payment_storage: payment_storage = Big_map.empty;

type orderId = string;

type return =  (list(operation), payment_storage);

let create_order = ((orderId, payment): (orderId, payment)): return => {

    /* Ensure that the user creating the payment is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can create payment");
   };

    /* Insert the payment into the storage */

    let payment_storage = Big_map.add(orderId, payment, init_order_storage);

    (([]: list(operation)), payment_storage)
}


let get_order = ((orderId): (orderId)): payment => {

    /* Get the payment from the storage */
        switch(Big_map.find_opt(orderId, init_order_storage)){
            | Some(payment)=>
                payment
            | None =>
                (failwith("Order not found"): payment)
        }

}

/**
* @param get orders
 * @returns {(list(operation), payment_storage)}
 */
let get_orders = (()): (list(operation), payment_storage) => {

    /* Get all orders from the storage */
    (([]: list(operation)), init_order_storage)

}


let update_order = ((orderId, payment): (orderId, payment)): return => {

    /* Ensure that the user updating the payment is admin */
   if(!admin_exists(Tezos.sender)) {
       failwith("Only admin can update payment");
   };


    /* Update the payment in the storage */
    let (_, new_order_storage) = Big_map.get_and_update(orderId, Some(payment), init_order_storage);

    (([]: list(operation)), new_order_storage)

}

let remove_order = ((orderId, _): (orderId, payment_storage)): return => {

      if(!admin_exists(Tezos.sender)) {
          failwith("Only admin can remove payment");
      };

    /* Remove the payment from the storage */

    let payment_storage = Big_map.remove(orderId, init_order_storage);

    (([]: list(operation)), payment_storage)
}


#include "../contracts/modules/order.religo"

let test = 
    let initial_order_storage = 
        Big_map.literal([("id",
       {
         id: "id",
         assetProviderId: "id",
         merchantId: "id",
         assetId: "id",
         units: "0",
         unitCost: "0",
         holidayProvision: "0",
         depositAmount: "0",
         installment: "0",
         installmentAmount: "0",
         totalOutStandingAmount: "0",
         paymentFreq: "string",
         paymentMethod: "string",
         status: "string",
         table: "table",
         orderBy: "string",
         createdAt: "string",
         updatedAt: "string"})]);

    let (order_ta, _, _) = Test.originate(main, initial_order_storage, 0tez);



    /* convert address to contract*/
    let order_ctr = Test.to_contract (order_ta);
    
    /* creating a order */
    let create_order: test_exec_result = Test.transfer_to_contract(order_ctr, Create([
        {
         id: "test_1",
         assetProviderId: "id",
         merchantId: "id",
         assetId: "id",
         units: "0",
         unitCost: "0",
         holidayProvision: "0",
         depositAmount: "0",
         installment: "0",
         installmentAmount: "0",
         totalOutStandingAmount: "0",
         paymentFreq: "string",
         paymentMethod: "string",
         status: "string",
         table: "table",
         orderBy: "string",
         createdAt: "string",
         updatedAt: "string"}
         ]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("create_order gas", create_order));


     /* Updating a order */
    let update_order: test_exec_result = Test.transfer_to_contract(order_ctr, Update([
        {
         id: "test_1",
         assetProviderId: "id",
         merchantId: "id",
         assetId: "id",
         units: "0",
         unitCost: "0",
         holidayProvision: "0",
         depositAmount: "0",
         installment: "0",
         installmentAmount: "0",
         totalOutStandingAmount: "0",
         paymentFreq: "string",
         paymentMethod: "string",
         status: "test_update",
         table: "table",
         orderBy: "string",
         createdAt: "string",
         updatedAt: "string"}
         ]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("update_order gas", update_order));


    /* Deleting a order */
    let delete_order: test_exec_result = Test.transfer_to_contract(order_ctr, Remove("test1"), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("remove_order gas", delete_order));
      
    ()

#include "../contracts/modules/transaction.religo"

let test = 
    let initial_transaction_storage = 
        Big_map.literal([("id",
       {
         id: "id",
         assetId: "19",
         dueDate: "1645822800000",
         paidOn: "",
         txType: "installment",
         owner: "Merchant",
         amount: "130",
         createdAt: "1645345483000",
         updatedAt: "1645345483000",
         orderId: "12",
         merchantId: "3",
         table: "table",
         assetProviderId: ""})]);

    let (transaction_ta, _, _) = Test.originate(main, initial_transaction_storage, 0tez);



    /* convert address to contract*/
    let transaction_ctr = Test.to_contract (transaction_ta);
    
    /* creating a transaction */
    let create_transaction: test_exec_result = Test.transfer_to_contract(transaction_ctr, Create([{
         id: "test_1",
         assetId: "19",
         dueDate: "1645822800000",
         paidOn: "",
         txType: "installment",
         owner: "Merchant",
         amount: "130",
         createdAt: "1645345483000",
         updatedAt: "1645345483000",
         orderId: "12",
         merchantId: "3",
         table: "table",
         assetProviderId: ""}]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("create_transaction gas", create_transaction));


     /* Updating a transaction */
    let update_transaction: test_exec_result = Test.transfer_to_contract(transaction_ctr, Update([{
         id: "test_1",
         assetId: "19",
         dueDate: "1645822800000",
         paidOn: "update",
         txType: "installment",
         owner: "Merchant",
         amount: "130",
         createdAt: "1645345483000",
         updatedAt: "1645345483000",
         orderId: "12",
         merchantId: "3",
         table: "table",
         assetProviderId: ""}]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("update_transaction gas", update_transaction));


    /* Deleting a transaction */
    let delete_transaction: test_exec_result = Test.transfer_to_contract(transaction_ctr, Remove("test1"), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("remove_transaction gas", delete_transaction));
      
    ()

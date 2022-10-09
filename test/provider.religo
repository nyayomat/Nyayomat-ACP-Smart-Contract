#include "../contracts/modules/provider.religo"

let test = 
    let initial_provider_storage = 
       Big_map.literal([("id",
       {
         id: "id",
         operatingDays: "operatingDays",
         status: "status",
         createdAt: "createdAt",
         updatedAt: "updatedAt",
         deletedAt: "deletedAt"})]);

    let (provider_ta, _, _) = Test.originate(main, initial_provider_storage, 0tez);



    /* convert address to contract*/
    let provider_ctr = Test.to_contract (provider_ta);
    
    /* creating a provider */
    let create_provider: test_exec_result = Test.transfer_to_contract(provider_ctr, Create([{
         id: "test_1",
         operatingDays: "operatingDays",
         status: "status",
         createdAt: "createdAt",
         updatedAt: "updatedAt",
         deletedAt: "deletedAt"}]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("create_provider gas", create_provider));


     /* Updating a provider */
    let update_provider: test_exec_result = Test.transfer_to_contract(provider_ctr, Update([{
         id: "test_1",
         operatingDays: "operatingDays",
         status: "status _ _ updated",
         createdAt: "createdAt",
         updatedAt: "updatedAt",
         deletedAt: "deletedAt"}]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("update_provider gas", update_provider));


    /* Deleting a provider */
    let delete_provider: test_exec_result = Test.transfer_to_contract(provider_ctr, Remove("test1"), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("remove_provider gas", delete_provider));
      
    ()

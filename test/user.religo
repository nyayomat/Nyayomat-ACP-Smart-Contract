#include "../contracts/modules/user.religo"

let test = 
    let initial_user_storage = 
        Big_map.literal([("id",
       {
         id: "id",
         onChainId: "tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU",
         shopId: "0",
         role: "init_owner",
         description: "description",
         roleId: "0",
         active: true,
         createdAt: "2020-01-01T00:00:00.000Z",
         updatedAt: "2020-01-01T00:00:00.000Z",
         deletedAt: "2020-01-01T00:00:00.000Z"})]);

    let (user_ta, _, _) = Test.originate(main, initial_user_storage, 0tez);



    /* convert address to contract*/
    let user_ctr = Test.to_contract (user_ta);
    
    /* creating a user */
    let create_user: test_exec_result = Test.transfer_to_contract(user_ctr, Create([{
         id: "test1",
         onChainId: "tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU",
         shopId: "0",
         role: "test_user",
         description: "description",
         roleId: "0",
         active: true,
         createdAt: "2020-01-01T00:00:00.000Z",
         updatedAt: "2020-01-01T00:00:00.000Z",
         deletedAt: "2020-01-01T00:00:00.000Z"}]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("create_user gas", create_user));


     /* Updating a user */
    let update_user: test_exec_result = Test.transfer_to_contract(user_ctr, Update([{
         id: "test1",
         onChainId: "tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU",
         shopId: "0",
         role: "test_user_update",
         description: "description",
         roleId: "0",
         active: true,
         createdAt: "2020-01-01T00:00:00.000Z",
         updatedAt: "2020-01-01T00:00:00.000Z",
         deletedAt: "2020-01-01T00:00:00.000Z"}]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("update_user gas", update_user));


    /* Deleting a user */
    let delete_user: test_exec_result = Test.transfer_to_contract(user_ctr, Remove("test1"), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("remove_user gas", delete_user));
      
    ()

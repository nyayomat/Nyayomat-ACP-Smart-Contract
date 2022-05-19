#include "../contracts/modules/asset.religo"

let test = 
    let initial_asset_storage = 
       Big_map.literal([("id",
       {
         id: "id",
         providerId: "providerId",
         name: "name",
         groupId: "groupId",
         subGroupId: "subGroupId",
         categoryId: "categoryId",
         image: "image",
         units: "units",
         unitCost: 0,
         holidayProvision: 0,
         depositAmount: 0,
         installment: 0,
         totalOutStandingAmount: "string",
         paymentFreq: "paymentFreq",
         paymentMethod: "paymentMethod",
         status: "status",
         owner: "owner",
         table: "table",
         createdAt: "createdAt",
         updatedAt: "updatedAt",
         deletedAt: "deletedAt"})]);

    let (asset_ta, _, _) = Test.originate(main, initial_asset_storage, 0tez);



    /* convert address to contract*/
    let asset_ctr = Test.to_contract (asset_ta);
    
    /* creating a asset */
    let create_asset: test_exec_result = Test.transfer_to_contract(asset_ctr, Create([
        {
         id: "id",
         providerId: "providerId",
         name: "name",
         groupId: "groupId",
         subGroupId: "subGroupId",
         categoryId: "categoryId",
         image: "image",
         units: "units",
         unitCost: 0,
         holidayProvision: 0,
         depositAmount: 0,
         installment: 0,
         totalOutStandingAmount: "string",
         paymentFreq: "paymentFreq",
         paymentMethod: "paymentMethod",
         status: "status",
         owner: "owner",
         table: "table",
         createdAt: "createdAt",
         updatedAt: "updatedAt",
         deletedAt: "deletedAt"}
         ]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("create_asset gas", create_asset));


     /* Updating a asset */
    let update_asset: test_exec_result = Test.transfer_to_contract(asset_ctr, Update([
        {
         id: "id",
         providerId: "providerId",
         name: "name",
         groupId: "groupId",
         subGroupId: "subGroupId",
         categoryId: "categoryId",
         image: "image",
         units: "units",
         unitCost: 0,
         holidayProvision: 0,
         depositAmount: 0,
         installment: 0,
         totalOutStandingAmount: "string",
         paymentFreq: "paymentFreq",
         paymentMethod: "paymentMethod",
         status: "status",
         owner: "owner",
         table: "table",
         createdAt: "createdAt",
         updatedAt: "updatedAt",
         deletedAt: "deletedAt"}
         ]), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("update_asset gas", update_asset));


    /* Deleting a asset */
    let delete_asset: test_exec_result = Test.transfer_to_contract(asset_ctr, Remove("test1"), 1mutez);

    /* get gas consumed */
    let _unit = Test.log(("remove_asset gas", delete_asset));
      
    ()

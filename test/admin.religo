#include "../src/core/admin.religo"

let assert_string_failure = ((res,expected) : (test_exec_result, string)) : unit => {
  let expected = Test.eval (expected) ;
  switch (res) {
  | Fail (Rejected (actual,_)) => assert (Test.michelson_equal (actual, expected))
  | Fail (Other) => failwith ("contract failed for an unknown reason")
  | Success (_) => failwith ("bad price check")
  }
} ;

let test =
    /* originate the contract with intial storage */
    let init_admin_storage = Big_map.literal ([
        (("tz2Lit89AC8iLEvDarnqpXxEQDPA3sqRXR1Z": address), {
            id: ("tz2Lit89AC8iLEvDarnqpXxEQDPA3sqRXR1Z": address),
            name: "tezz_admin",
            created_at: "2019-01-01T00:00:00Z",
            updated_at: "2019-01-01T00:00:00Z",
        }), ]);

    let (admin_contract, _, _) = Test.originate(create_admin, init_admin_storage, 0tez);

        let pedro_taco_shop_ctr = Test.to_contract (admin_contract);

    // assert (Test.get_storage(admin_contract) == init_admin_storage)
()
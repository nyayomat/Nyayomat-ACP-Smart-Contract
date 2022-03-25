#include "./types/listing.religo"

type parameter = int
type storage = int

type return = (list(operation), storage)


///////////////////////////////////////////
//              Entry Point             //
//////////////////////////////////////////
let main = ((parameter, storage): (parameter, storage)): return => {

    ((
        []: list(operarion)
    ), 
    storage + parameter
    )
}
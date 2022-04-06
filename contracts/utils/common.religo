
let is_owner = (()): bool => {
  Tezos.sender == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU"
       : address)
};

let is_admin = (user: address): bool => {
  user == ("tz1MwDG66PtctWRXLTNJ89BLWjPtwCm9gXVU" : address)
};

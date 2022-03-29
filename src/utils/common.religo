
let is_owner = (): bool => {
    /// TODO : Check if the user is the owner of the s.c
    Tezos.sender == ("tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN": address)
}
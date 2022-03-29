
let is_owner = (): bool => {
    /// TODO : Check if the user is the owner of the s.c
    Tezos.sender == ("tz1a1BxmvXv3zj3tLj3LJXq3uZ7nZ7cqQ1J3": address)
}
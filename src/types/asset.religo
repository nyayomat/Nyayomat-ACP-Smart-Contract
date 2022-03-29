#include "./provider.religo"

type metadata = {
    name: string,
    image: string,
    description: string
}
type asset = {
    id: string,
    unit: nat,
    unitCost: tez,
    metadata: metadata,
    provider: provider,
    owner: address,
    createdAt: timestamp,
    updatedAt: timestamp

}


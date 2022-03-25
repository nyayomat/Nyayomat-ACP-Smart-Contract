type orderStatus = Pending | Declined | Approved
type paymentMethod = Mpesa | Card | Bank | Cash
type paymentFrequency = Daily | Weekly | Monthly | Yearly


type merchant_order = {
    id: string,
    listingId: string,
    units: nat,
    paymentFrequency: paymentFrequency,
    paymentMethod: paymentMethod,
    status: option(orderStatus),
    createdAt: timestamp,
    updatedAt: timestamp
}
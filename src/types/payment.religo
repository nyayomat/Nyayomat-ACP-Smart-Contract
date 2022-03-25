type orderStatus = Pending | Declined | Approved
type paymentType = Covered | Fullfilled
type txType = Deposit | Installment


type payment = {
    id: string,
    paymentType: paymentType,
    listingId: string,
    txId: string,
    txHash: string,
    amount: tez,
    txType: txType,
    from: string,
    to: string,
    installmentNum: option(nat),
    createdAt: timestamp,
    updatedAt: timestamp
}
#include "./asset.religo"

type paymentFrequency = Daily | Weekly | Monthly | Yearly
type paymentMethod = Mpesa | Card | Bank | Cash
type listingType = APListing | MerchantListing

type listing = {
    id: string,
    asset: asset,
    holidays: nat,
    depositAmount: tez,
    numOfInstallments: nat,
    paymentFrequency: paymentFrequency,
    paymentMethod: paymentMethod,
    group: string,
    subGroup: string,
    category: string,
    status: option(status),
    listingType: listingType,
    createdAt: timestamp,
    updatedAt: timestamp
}
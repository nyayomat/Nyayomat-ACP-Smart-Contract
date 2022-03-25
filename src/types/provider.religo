///////////////////////////////////////////
//              Types                    //
//////////////////////////////////////////

type providerStatus = Approved | Declined | Shortlisted
type providerOperatingDays = Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday

type provider = {
    id: string,
    name: string,
    info: option(bytes),
    status: providerStatus,
    operatingDays: providerOperatingDays
}
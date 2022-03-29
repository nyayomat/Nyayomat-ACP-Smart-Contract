///////////////////////////////////////////
//              Types                    //
//////////////////////////////////////////

type status = Approved | Declined | Shortlisted | Pending 
type providerOperatingDays = Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday

type provider = {
    id: string,
    name: string,
    info: option(string),
    status: status,
    operatingDays: list(providerOperatingDays)
}
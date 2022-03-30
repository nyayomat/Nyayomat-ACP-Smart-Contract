type status = Approved | Declined | Shortlisted | Pending;

type providerOperatingDays = 
  Monday
| Tuesday
| Wednesday
| Thursday
| Friday
| Saturday
| Sunday;

type provider = {
  id: string,
  name: string,
  info: option(string),
  status,
  operatingDays: list(providerOperatingDays)};

type metadata = {
  name: string,
  image: string,
  description: string};

type asset = {
  id: string,
  unit: nat,
  unitCost: tez,
  metadata,
  provider,
  owner: address,
  createdAt: timestamp,
  updatedAt: timestamp};

# Mail Ballot Manager APIs

## Open Questions

- If there is an error in the election data, how does a election official start
  over?
- If there is an error in the voter mailing list, how does an election official
  fix it?
- If an election official needs to stop the presses, can they?

## Types

Election as defined in `@votingworks/ballot-encoder` and the following…

```
interface VoterMailBallot {
  electionId: string, // first 10 of sha256 of election definition
  id: string,
  firstName: string,
  middleName?: string,
  lastName: string,
  nameSuffix?: string,
  street1: string,
  street2?: string,
  city: string,
  state: string,
  zipcode: string,
  ballotStyle: string,
  precinctId: string,
  ballotfile: string, // filepath?
  ballotCreated?: timestamp,
  ballotPrinterReceived?: timestamp,
  ballotPrinterPrinted?: timestamp
  ballotOutboundSent?: timestamp
  ballotOutboundDelivered?: timestamp
  ballotInboundSent?: timestamp
  ballotInboundDelivered?: timestamp
}
```

```
interface BallotTemplate {
  fileName: string,
  fileContent: pdfFile,     // or filepath? Perhaps different for upload vs list.
  ballotStyle: BallotStyle, // As as defined in `@votingworks/ballot-encoder`
  precinct: Precinct,       // As as defined in `@votingworks/ballot-encoder`
}
```

```
interface InsertsData {
  affadavit?: string,
  instructions?: string,
  helpPhone?: string,
  helpEmail?: string,
  helpWeb?: string,
  helpAddress?: string,
}
```

## Auth API

Whatever Auth0 uses here.

## Users API

What user date is provided by default via Auth0?

### `GET /auth/me`

```
{
  id: string,
  email: string,
}
```

## Elections API

### `POST /election/`

```
{
  name: string
}
```

returns

```
{
  id: string // the newly minted election UUID (not meaningful to the user, should not be displayed)
}
```

### `GET /elections/`

```
[{
  id: string, // a UUID for this election (not meaningful to the user, should not be displayed)
  createdAt: datetime,
  shortIdentifier: string, // a short hex identifier, first 10 of sha256 of election definition
  name: string,
  packageHash: string,
  printingAndMailingApprovedAt?: datetime,
  printingAndMailingApprovedBy?: userId,
  voterCount: number,
}]
```

### `GET /elections/<election_id>`

Returns a single election with some more data than the list:

```
{
  id: string,
  createdAt: datetime,
  shortIdentifier: string,
  name: string,
  packageHash: string,
  printingAndMailingApprovedAt?: datetime,
  printingAndMailingApprovedBy?: userId,
  voterCount: number,
  mailingListFiles: [
	{
		label: string,
		uploadedAt: datetime,
		voterCount: number
	},
	...
  ]
}
```

## Election Definition

### `PUT /elections/<election_id>/definition`

### `GET /elections/<election_id>/definition`

## Ballot Templates

### `PUT /elections/<election_id>/ballot-style/<ballot_style>/precinct/<precinct>/template`

### `GET /elections/<election_id>/ballot-style/<ballot_style>/precinct/<precinct>/template`

## Voters API

### `GET /elections/:electionId/voters`

Should this endpoint return all or a subset with offset value?

```
{
  voters: VoterMailBallot[]
}
```

#### params

- count: number of records to return
- offset: start of count
- text search? (see README)
- filters? (see README)

## Inserts Data API

### `GET /election/:electionId/inserts-data`

```
InsertsData
```

### `PUT /election/:electionId/inserts-data`

```
InsertsData
```

## Approve Printing and Mailing API

### `POST /election/:electionId/approve-printing-and-mailing`

Updates election data:

- printingAndMailingApprovedAt: datetime,
- printingAndMailingApprovedBy: userId,

## Export API

### `GET /election/:electionId/export`

TBD if this is one export or multiple. What is exported?

- All election data?
- All voter mail ballot records?
- All ballot PDFs?

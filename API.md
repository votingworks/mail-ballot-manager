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
  id: string,
  firstName: string,
  middleName: string,
  lastName: string,
  nameSuffix: string,
  street1: string,
  street2: string,
  city: string,
  state: string,
  zipcode: string,
  ballotStyle: string,
  precinctId: string,
  ballotfile: string, // filepath?
  ballotCreated: timestamp,
  ballotPrinterReceived: timestamp,
  ballotPrinterPrinted: timestamp
  ballotOutboundSent: timestamp
  ballotOutboundDelivered: timestamp
  ballotInboundSent: timestamp
  ballotInboundDelivered: timestamp
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
  affadavit: string,
  instructions: string,
  helpPhone: string,
  helpEmail: string,
  helpWeb: string,
  helpAddress: string,
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

### `GET /elections/list`

```
[{
  id: string,
  definition: Election,
  packageHash: string,
  printingAndMailingApprovedAt: datetime,
  printingAndMailingApprovedBy: userId,
  ballotTemplates: BallotTemplate[],
  voters: VoterMailBallot[],
  uploadedAt: datetime,
}]
```

### `POST /election`

```
{
  definition: Election,
  packageHash: string,
  ballotTemplates: BallotTemplate[],
  voterMailingListCSV: string,
}
```

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

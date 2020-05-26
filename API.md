# Mail Ballot Manager APIs

## Open Questions

- If there is an error in the election data, how does a election official start
  over?
- If there is an error in the voter mailing list, how does an election official
  fix it?
- If an election official needs to stop the presses, can they?

## Types

See `server/models.py`

## Auth API

Whatever Auth0 uses here.

## Users API

What user data is provided by default via Auth0?

### `GET /api/auth/me`

```
{
  id: string,
  email: string,
}
```

## Elections API

### `POST /api/mailelection/`

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

### `GET /api/mailelection/`

```
[{
  id: string,
  createdAt: datetime,
  electionHash?: string, // the hex SHA256 of the election.json
  name: string,
  electionTitle: string,
  electionDate: string,
  packageHash: string, // ? this might require a change in how we upload or something else (TBD)
  approvedAt?: datetime,
  approvedBy?: userId,
  voterCount: number,
}]
```

### `GET /api/mailelection/<mailelection_id>`

Returns a single election with some more data than the list:

```
{
  id: string,
  createdAt: datetime,
  electionHash: string,
  name: string,
  electionTitle: string,
  electionDate: string,
  packageHash: string,
  approvedAt?: datetime,
  approvedBy?: userId,
  voterCount: number,
  mailingListFiles: [
  {
    id: string,
    label: string,
    fileName: string,
    uploadedAt: datetime,
    voterCount: number
  },
  mailBatches: [
  {
    id: string,
    label: string,
    sentAt: datetime,
    voterCount: number
  },
  ...
  ]
}
```

## Election Definition

### `PUT /api/mailelection/<mailelection_id>/definition`

Accepts json string of Election as the `PUT` body, content-type `application/json`

### `GET /api/mailelection/<mailelection_id>/definition`

Returns json string of Election

## Ballot Templates

### `PUT /api/mailelection/<mailelection_id>/ballot-style/<ballot_style_id>/precinct/<precinct_id>/template`

### `GET /api/mailelection/<mailelection_id>/ballot-style/<ballot_style_id>/precinct/<precinct_id>/template`

## Voters API

### `PUT /api/mailelection/<mailelection_id>/voters/file`

Load the voters file -- only one file for now.

The voters file is a CSV with fields to be found in `server/voters.py`

### `GET /api/mailelection/<mailelection_id>/voters`

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

### `GET /api/mailelection/<mailelection_id>/inserts-data`

```
InsertsData
```

### `PUT /api/mailelection/<mailelection_id>/inserts-data`

```
InsertsData
```

## Mail Ballot Batches

### `POST /api/mailelection/<mailelection_id>/create-batch-from-unassigned`

### `POST /api/mailelection/<mailelection_id>/batches/:batchId/send`

### `GET /api/mailelection/<mailelection_id>/batches`

Returns all batches of mailed ballots.

## Export API

### `GET /api/mailelection/<mailelection_id>/export`

TBD if this is one export or multiple. What is exported?

- All election data?
- All voter mail ballot records?
- All ballot PDFs?

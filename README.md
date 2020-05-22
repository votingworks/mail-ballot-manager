# Mail Ballot Manager

This is an online tool to manage the printing, mailing, and tracking of ballots to and from voters.

This tool **does not** provide any features handled by other offline apps such as:

- manage election ballot data
- create ballots
- track ballots received by jurisdiction
- provide signature verification
- scan/tally ballots

## Workflow from Zero Content

1. Admin authenticates into online app.
2. Admin is on the Elections screen where there is a button to Create Election.
3. Admin types name into text field and clicks button to Create Election.
4. Admin is back on the Elections screen which lists the election they just created and has a button to create a new election. Admin selects the election which they just created.
5. Admin is on the Election Screen which has three tabs:

   - Election (default selected)
   - Inserts
   - Voters

6. Admin uploads Election Ballot Package.
7. Admin edits and proofs the Election Inserts.
8. Admin uploads a Voter Mailing List.
9. Election has now has everything necessary to send ballots to the voters. Admin clicks button to Send Batch Ballots.
10. Admin is prompted to name the batch. Name defaults to current date and time.
11. Admin clicks send. Upon sending first batch of ballots, they may no longer replace the Election Ballot Package, edit election name, or edit the Insert Templates.
12. Admin uploads additional Voter Mailing Lists.
13. Admin sends another batch.
    - This upload and send batch process repeats until there are no more to send.
14. Admin has an interface to track progress of each ballot.
15. Tracking Data can be exported.

## App Screens

- Auth Screen
- Elections Screen
  - Rows:
    - name
    - title
    - date
    - county
    - state
    - status
  - Create New Election
- Create Election Screen
  - Copy Election Data from select existing election (optional)
  - Name
  - Create Election button
- Election Screen
  - Edit election name
  - Upload/Replace Election Ballot Package
  - Election Mail Ballot Stats
  - List batches sent
  - Send new batch
- Election Inserts Screen
  - Features to edit and proof the Insert Templates. UI TBD.
- Election Voters Screen
  - Upload Voter Mailing List
  - Rows:
    - voter id
    - voter name
    - voter address
    - voter ballot style
    - voter precinct
    - upload file name
    - ballot printed (timestamp)
    - ballot sent to voter (timestamp)
    - ballot delivered to voter (timestamp)
    - ballot sent to jurisdiction (timestamp)
    - ballot delivered to jurisdiction (timestamp)
    - view ballot link (opens PDF)
  - Filters: (list automatically updated to match filter)
    - ballot style
    - precinct
    - upload file name
    - ballot printed
    - ballot not printed
    - ballot sent to voter
    - ballot not sent to voter
    - ballot delivered to voter
    - ballot not delivered to voter
    - ballot sent to jurisdiction
    - ballot not sent to jurisdiction
    - ballot delivered to jurisdiction
    - ballot not delivered to jurisdiction
  - Text Search: (list automatically updated to match text query)
    - name
    - address
  - Screen Summary:
    - number of voters (matching [insert filter and/or search])

## Open Questions

- Does this app offer a click to view the ballot for a specific voter?
  - Yes, on demand.
- Authenticate with Auth0 (and/or do we send laptop with auth/keys)?
  - TBD
- Is app single or multi-tenant?
  - Default single jurisdiction to id=1 until multi-jurisdiction support.
- After first batch is sent what Election data can no longer be changed?
  - Election Ballot Package.
  - Election Name.
  - Inserts Content.
  - Voters who have been sent ballots.
- Should the upload of a Voter Mailing List do any de-duplicating of voters already uploaded?
- Should the admin be able to remove voters after then have uploaded a mailing list?
- When do all Voter Mail Ballot PDFs get created?
- How does a voter confirm that their ballot hasn't been modified from the approved template?
- Can election official view Voter Mail Ballot PDF after print and mail has been approved?
- Are Voter Mail Ballots created automatically after data is uploaded or on demand (for preview and pre-sending to mail house)?

## Running in Development

On Linux for now.

Get your dev environment ready:

```
cp server/config/database.cfg.dev server/config/database.cfg
make dev-environment
```

Whenever you want to reset the database:

```
make resetdb
```

Running the Python backend and React front-end with auto-reload:

```
./run-dev.sh
```

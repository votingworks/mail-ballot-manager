# VBM Ballot Manager

This is an online tool to manage the printing, mailing, and tracking of ballots to and from voters. 

This tool **does not** provide any features handled by other offline apps such as:
- manage election ballot data
- create ballots
- track ballots received by jurisdiction
- provide signature verification
- scan/tally ballots

## Workflow

1. Admin authenticates into online app.
1. Admin uploads an **Election Ballot Package** (zip file) which was exported from VxMail Ballot Creator.

   Election Ballot Package contains:
   - election.json (VotingWorks data format for election data: contests, canidates, ballot styles, precincts, etc)
   - approved official ballots in pdf format:
     - one for each combination of ballot style and precinct
     - file name pattern: `ballot-style-7-precinct-8.pdf`

1. Admin uploads **Voter Mailing List**

   Voter Mailing List contains:
   - id (unique identifier for voter from the jurisdiction)
   - name (first name, middle name, last name, suffix)
   - mailing address (street, apt/unit/suite, city, state, zip)
   - ballot style id
   - precinct id

2. Admin approves ballots for print and mailing.
3. Admin has an interface to track progress of each ballot.
4. Tracking Data can be exported.

## App Screens
- Upload Election Ballot Package
- Upload Voter Mailing List
- Print and Mailing Screen
  - Summary:
    - total number of ballots to be printed and sent
    - ballot styles with number of voters per ballot style
    - precincts with number of voters per ballot style
  - Button to "Print and Sent Ballots to Voters"
- Ballot Tracking Table
  - Rows: 
    - voter id
    - voter name
    - voter address
    - voter ballot style
    - voter precinct
    - ballot printed (timestamp)
    - ballot sent to voter (timestamp)
    - ballot delivered to voter (timestamp)
    - ballot sent to jurisdiction (timestamp)
    - ballot delivered to jurisdiction (timestamp)
    - view ballot (opens PDF)
  - Filters: (list automatically updated to match filter)
    - ballot style
    - precinct
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
  - TBD
- Authenticate with Auth0 (and/or do we send laptop with auth/keys)?
  - TBD
- Is app single or multi-tenant?
  - Default single jurisdiction to id=1 until multi-jurisdiction support.

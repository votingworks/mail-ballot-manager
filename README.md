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

Requires Linux or Docker.

1. Get your dev environment ready:

   cp server/config/database.cfg.dev server/config/database.cfg
   make dev-environment

2. Run the Python backend and React front-end with auto-reload:

```
./run-dev.sh
```

or to show QA Codes

```
REACT_APP_SHOW_SAMPLE_QA_CONTENT=TRUE ./run-dev.sh
```

Whenever you want to reset the database:

    make resetdb

## Developer Setup on Mac with a Linux VM

On the host machine, setup a VM using Parallels:

1.  Download Ubuntu Desktop `.iso` image file: [ubuntu-18.04.4-desktop-amd64.iso](https://releases.ubuntu.com/18.04.4/ubuntu-18.04.4-desktop-amd64.iso)
2.  Install Parallels.
    ```
    brew cask install parallels
    ```
3.  Create Parallels VM using the Ubuntu iso image file.

On the VM:

1.  Install NVM (curl is an install dependency):
    ```
    sudo apt install curl
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
    ```
    Close terminal and reopen.
    ```
    nvm install 12
    ```
2.  Install `git`.
3.  `git clone` this project on the VM.
4.  Follow steps above for "Running in Development".
5.  Setup Github access to allow pushing to repos.

### Optional Steps

1. Install gpg to sign commits.
2. 2. Setup VS Code to use ["Remote - SSH"](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension to be able to edit files and access the terminal from within VS Code… and forward ports such that you can use a browser on the host as well.
3. Setup dotfiles to your preference.

### Setup SSH Host Shortcut

Set up ssh host shortcut such that you can type `ssh vx` to connect to VM:

1.  Open Settings in the VM (click the caret in the top right to reveal menu to click button to open "Settings").
2.  Open Network in sidebar.
3.  Click the gear next to the "Connected" in the "Wired" section.
4.  Copy the IP address. Eg. `10.211.55.3`.
5.  On the host machine, create/open the file `~/.ssh/config` and add:
    ```
    Host vx
      HostName 10.211.55.3
    ```
6.  Confirm this works by typing `ssh vx` to ssh into the VM. If your username is different on the VM than the host, add `User USER` to the ssh config for `vx` in `~/.ssh/config`.
7.  Copy ssh public key fron the host machine `~/.ssh/id_rsa.pub` to the VM `~/.ssh/authorized_keys` for connecting without entering a password.
    ```
    cat ~/.ssh/id_rsa.pub | ssh vx 'cat >> ~/.ssh/authorized_keys'
    ```

### Troubleshooting

#### Error message: `Error: ENOSPC: System limit for number of file watchers reached`

[Increase the amount of watchers](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers#the-technical-details):

    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p

### Can't find `pipenv`?

You may need to update your `PATH` to include `~/.local/bin/`:

    export PATH="${HOME}/.local/bin:${PATH}"

### Issues Installing Yarn via make?

Instead of `sudo npm install -g yarn`, try this:

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update
    sudo apt install yarn

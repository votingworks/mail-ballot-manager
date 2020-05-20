import React, { useRef, useCallback, useState } from 'react'
import './App.css'
import { readBallotPackage } from './util/ballot-package'
import { Election } from '@votingworks/ballot-encoder'

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [election, setElection] = useState<Election>()
  const [ballotNames, setBallotNames] = useState<string[]>()

  const onInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.currentTarget

      if (!files) {
        return
      }

      for (const file of files) {
        const ballotPackage = await readBallotPackage(file)

        setElection(ballotPackage.election)
        setBallotNames(
          ballotPackage.ballots.map(
            (ballot) => `${ballot.ballotStyle.id} / ${ballot.precinct.name}`
          )
        )
      }
    },
    []
  )

  if (!election || !ballotNames) {
    return <input type="file" ref={inputRef} onChange={onInputChange} />
  }

  return (
    <React.Fragment>
      <h1>Election: {election.title}</h1>

      <p>Ballots:</p>
      <ul>
        {ballotNames.map((ballotName) => (
          <li>{ballotName}</li>
        ))}
      </ul>
    </React.Fragment>
  )
}

export default App

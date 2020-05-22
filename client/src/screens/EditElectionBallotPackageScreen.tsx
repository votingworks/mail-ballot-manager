import React, { useCallback, useState } from 'react'
import { Election } from '@votingworks/ballot-encoder'

import { readBallotPackage } from '../util/ballot-package'
import { MainChild } from '../components/Main'
import Prose from '../components/Prose'
import FileInputButton from '../components/FileInputButton'

const EditElectionBallotPackageScreen = () => {
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
    return (
      <MainChild>
        <Prose>
          <h1>Upload Election Ballot Package</h1>
          <p>
            <FileInputButton
              id="election-ballot-package"
              accept="application/zip"
              onChange={onInputChange}
            >
              Select Election Ballot Package
            </FileInputButton>
          </p>
        </Prose>
      </MainChild>
    )
  }

  return (
    <MainChild>
      <Prose>
        <h1>Upload Election Ballot Package</h1>

        <p>
          Election:{' '}
          {`${election.title}, ${election.date}, ${election.county.name}, ${election.state}`}
        </p>
        <p>{ballotNames.length} Ballots:</p>
        <ul>
          {ballotNames.map((ballotName) => (
            <li key={ballotName}>{ballotName}</li>
          ))}
        </ul>
      </Prose>
    </MainChild>
  )
}

export default EditElectionBallotPackageScreen

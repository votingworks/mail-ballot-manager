import React, { useContext, useCallback, useState } from 'react'
import { Election } from '@votingworks/ballot-encoder'
import { useParams, useHistory } from 'react-router-dom'

import { ElectionScreenProps } from '../config/types'
import AppContext from '../contexts/AppContext'

import { putElectionDefinition, putBallotTemplate } from '../api'
import { readBallotPackage, BallotPackageEntry } from '../util/ballot-package'

import { MainChild } from '../components/Main'
import Prose from '../components/Prose'
import FileInputButton from '../components/FileInputButton'
import { routerPaths } from '../components/MailBallotManager'

const EditElectionBallotPackageScreen = () => {
  const history = useHistory()
  const { electionId } = useParams<ElectionScreenProps>()
  const { loadMailElections } = useContext(AppContext)

  const [election, setElection] = useState<Election>()
  const [ballotNames, setBallotNames] = useState<string[]>()
  const [
    currentUploadingBallotIndex,
    setCurrentUploadingBallotIndex,
  ] = useState(-1)
  const [totalTemplates, setTotalTemplates] = useState(0)
  const [currentUploadingBallot, setCurrentUploadingBallot] = useState<
    BallotPackageEntry
  >()

  const onInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.currentTarget

      if (files?.length === 1) {
        const file = files[0]
        readBallotPackage(file).then(async ({ election, ballots }) => {
          await putElectionDefinition({ electionId, election })
          setCurrentUploadingBallotIndex(0)
          setTotalTemplates(ballots.length)

          for (const ballot of ballots) {
            setCurrentUploadingBallot(ballot)
            await putBallotTemplate({
              ballotStyleId: ballot.ballotStyle.id,
              electionId,
              file: ballot.file,
              precinctId: ballot.precinct.id,
            })
            setCurrentUploadingBallotIndex((prev) => prev + 1)
          }

          setElection(election)
          setBallotNames(
            ballots.map(
              (ballot) => `${ballot.ballotStyle.id} / ${ballot.precinct.name}`
            )
          )
          loadMailElections()
          history.push(routerPaths.election({ electionId }))
        })
      }
    },
    [electionId, history, loadMailElections]
  )

  if (totalTemplates > 0 && currentUploadingBallot) {
    return (
      <MainChild center>
        <Prose textCenter>
          <h1>
            Uploading Ballot {currentUploadingBallotIndex + 1} of{' '}
            {totalTemplates}
          </h1>
          <p>
            {currentUploadingBallot.ballotStyle.id} /{' '}
            {currentUploadingBallot.precinct.name}
          </p>
        </Prose>
      </MainChild>
    )
  }

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

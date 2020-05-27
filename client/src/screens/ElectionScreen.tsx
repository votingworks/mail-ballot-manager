import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'

import AppContext, { getElection } from '../contexts/AppContext'
import LinkButton from '../components/LinkButton'
import { routerPaths } from '../components/MailBallotManager'
import Prose from '../components/Prose'
import { ElectionScreenProps } from '../config/types'
import { shortDate } from '../utils/datetime'

const ElectionScreen = () => {
  const { electionId } = useParams<ElectionScreenProps>()
  const { mailElections, voters } = useContext(AppContext)
  const { name, createdAt, electionTitle, electionDate } = getElection({
    mailElections: mailElections!,
    electionId,
  })
  const hasElectionBallotPackage = !!electionTitle && !!electionDate
  const hasVoters = !!voters?.length
  const readyToPrint = hasElectionBallotPackage && hasVoters

  return (
    <Prose>
      <h1>{name}</h1>
      <p>
        createdAt: {createdAt}
        <br />
      </p>
      {hasElectionBallotPackage ? (
        <p>
          {electionTitle}, {shortDate(electionDate!)}
        </p>
      ) : (
          <p>
            <LinkButton
              to={routerPaths.electionUploadBallotPackage({ electionId })}
            >
              Add Election Ballot Package
          </LinkButton>
          </p>
        )}
      {hasVoters ? (
        <p>
          <LinkButton to={routerPaths.elections} disabled={!readyToPrint}>
            Send Batch
          </LinkButton>
        </p>
      ) : (
          <p>-- place Upload voter mailing list input here --</p>
        )}
    </Prose>
  )
}

export default ElectionScreen

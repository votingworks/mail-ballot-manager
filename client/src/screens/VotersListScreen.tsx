import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { getPrecinctById } from '@votingworks/ballot-encoder'

import { ElectionScreenProps } from '../config/types'
import AppContext, { getElection } from '../contexts/AppContext'

import LinkButton from '../components/LinkButton'
import { routerPaths } from '../components/MailBallotManager'
import Prose from '../components/Prose'
import Table from '../components/Table'

const VotersListScreen = () => {
  const { electionId } = useParams<ElectionScreenProps>()
  const { voters, elections } = useContext(AppContext)
  const election = getElection({ elections: elections!, electionId })
  const { title, definition } = election
  return (
    <Prose maxWidth={false}>
      <h1>Voters for {title}</h1>
      <p>
        <LinkButton small>Add VoterMailingList</LinkButton>
      </p>
      <Table>
        <thead>
          <tr>
            <th>First</th>
            <th>Middle</th>
            <th>Last</th>
            <th>Suffix</th>
            <th>Precinct</th>
            <th>Ballot Style</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {voters.map(
            ({
              id,
              firstName,
              middleName,
              lastName,
              nameSuffix,
              street1,
              street2,
              city,
              state,
              zipcode,
              ballotStyleId,
              precinctId,
            }) => (
              <tr key={id}>
                <td>{firstName}</td>
                <td>{middleName}</td>
                <td>{lastName}</td>
                <td>{nameSuffix}</td>
                <td>
                  {definition &&
                    getPrecinctById({ election: definition, precinctId })?.name}
                </td>
                <td>{ballotStyleId}</td>
                <td>STATUS</td>
                <td>
                  <LinkButton
                    small
                    to={routerPaths.voterBallot({
                      voterId: id,
                      electionId,
                    })}
                  >
                    view ballot
                  </LinkButton>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </Prose>
  )
}

export default VotersListScreen

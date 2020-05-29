import React, { useContext } from 'react'

import AppContext from '../contexts/AppContext'
import LinkButton from '../components/LinkButton'
import { routerPaths } from '../components/MailBallotManager'
import Prose from '../components/Prose'
import Table from '../components/Table'
import { shortDate } from '../utils/datetime'
import truncateString from '../utils/truncateString'

const ElectionsScreen = () => {
  const { mailElections, voters } = useContext(AppContext)
  return (
    <Prose maxWidth={false}>
      <h1>Elections</h1>
      <p>
        <LinkButton small to={routerPaths.electionsAdd}>
          Add Election
        </LinkButton>
      </p>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Title</th>
            <th>Date</th>
            <th>Voters</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {mailElections?.map((mailElection) => {
            const { name, createdAt, electionTitle, electionDate } = mailElection
            return (
              <tr key={mailElection.id}>
                <td>{truncateString(name, 20)}</td>
                <td>{shortDate(createdAt)}</td>
                <td>{electionTitle || '-'}</td>
                <td>{electionDate ? electionDate.toString() : '-'}</td>
                <td>{voters[mailElection.id]?.length}</td>
                <td>STATUS</td>
                <td>
                  <LinkButton
                    small
                    to={routerPaths.election({ electionId: mailElection.id })}
                  >
                    View Election
                  </LinkButton>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Prose>
  )
}

export default ElectionsScreen

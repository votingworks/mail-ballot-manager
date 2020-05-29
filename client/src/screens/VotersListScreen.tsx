import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getPrecinctById } from '@votingworks/ballot-encoder'

import readFileAsync from '../lib/readFileAsync'

import { InputEventFunction, ElectionScreenProps } from '../config/types'

import AppContext from '../contexts/AppContext'

import { putVoterMailingList, getVoters } from '../api'

import { MainChild } from '../components/Main'
import { routerPaths } from '../components/MailBallotManager'
import FileInputButton from '../components/FileInputButton'
import LinkButton from '../components/LinkButton'
import Loading from '../components/Loading'
import Prose from '../components/Prose'
import Table from '../components/Table'

const VotersListScreen = () => {
  const { electionId } = useParams<ElectionScreenProps>()
  const { setVoters, voters } = useContext(AppContext)

  const [isLoading, setIsLoading] = useState(!voters)
  const [isVoterMailingListError, setIsVoterMailingListError] = useState(false)

  const getVotersForElection = useCallback(async () => {
    const { voters: newVoters } = await getVoters({ electionId })
    setVoters(v => ({
      ...v,
      [electionId]: newVoters
    }))
    setIsLoading(false)
  }, [setVoters, electionId])

  useEffect(() => {
    !voters && getVotersForElection()
  }, [getVotersForElection, voters])

  const handleVoterMailingListCSV: InputEventFunction = async (event) => {
    setIsLoading(true)
    const input = event.currentTarget
    const file = input.files && input.files[0]

    if (file) {
      setIsVoterMailingListError(false)
      try {
        const fileContent = await readFileAsync(file)
        await putVoterMailingList({ electionId, voterMailingListFile: fileContent })
        getVotersForElection()
      } catch (error) {
        setIsVoterMailingListError(true)
        setIsLoading(false)
        console.error('handleVoterMailingListCSV failed', error) // eslint-disable-line no-console
      }
    }
  }

  const definition = false

  const paginatedVoters = voters[electionId]?.slice(0, 100)

  if (isLoading) {
    return (
      <MainChild center>
        <Loading isFullscreen />
      </MainChild>
    )
  }

  return (
    <MainChild>
      <Prose maxWidth={false}>
        {!!paginatedVoters?.length ? (
          <React.Fragment>

            <h1>Voters</h1>
            {/* <p>
            <LinkButton small>Add another VoterMailingList…</LinkButton>
          </p> */}
            <p>Upload Election Ballot Package to see precinct names.</p>
            <p>1–{paginatedVoters.length} of {voters!.length} voters</p>
            <Table>
              <thead>
                <tr>
                  <th>First</th>
                  <th>Middle</th>
                  <th>Last</th>
                  <th>Suffix</th>
                  <th>{definition ? 'Precinct' : 'Precinct ID'}</th>
                  <th>Ballot Style</th>
                  <th>street1</th>
                  <th>street2</th>
                  <th>city</th>
                  <th>state</th>
                  <th>zipCode</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paginatedVoters.map(
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
                    zipCode,
                    ballotStyleId,
                    precinctId,
                  }) => (
                      <tr key={id}>
                        <td>{firstName}</td>
                        <td>{middleName}</td>
                        <td>{lastName}</td>
                        <td>{nameSuffix}</td>
                        <td>
                          {definition ?
                            getPrecinctById({ election: definition, precinctId })?.name : precinctId}
                        </td>
                        <td>{ballotStyleId}</td>
                        <td>{street1}</td>
                        <td>{street2}</td>
                        <td>{city}</td>
                        <td>{state}</td>
                        <td>{zipCode}</td>
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
          </React.Fragment>
        ) : (
            <React.Fragment>
              <h1>Voters</h1>
              {isVoterMailingListError && (
                <p>Invalid Voter Mailing List CSV File.</p>
              )}
              <p>
                <FileInputButton
                  id="voter-mailing-list"
                  name="voter-mailing-list"
                  accept=".csv,text/csv"
                  onChange={handleVoterMailingListCSV}
                >
                  Select Voter Mailing List CSV file…
              </FileInputButton>
              </p>
            </React.Fragment>
          )}
      </Prose>
    </MainChild>
  )
}

export default VotersListScreen

// import React, { useContext } from 'react'
// import { useParams } from 'react-router-dom'
// import { getPrecinctById } from '@votingworks/ballot-encoder'

// import { ElectionScreenProps } from '../config/types'
// import AppContext, { getElection } from '../contexts/AppContext'

// import LinkButton from '../components/LinkButton'
// import { routerPaths } from '../components/MailBallotManager'
// import Prose from '../components/Prose'
// import Table from '../components/Table'

// const VotersListScreen = () => {
//   const { electionId } = useParams<ElectionScreenProps>()
//   const { voters, mailElections } = useContext(AppContext)
//   const election = getElection({ mailElections, electionId })
//   const { electionTitle, definition } = election
//   return (

//   )
// }

// export default VotersListScreen

import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { createElection, getElection } from '../api'
import AppContext from '../contexts/AppContext'
import { InputEventFunction, FormEventFunction } from '../config/types'

import { MainChild } from '../components/Main'
import Button from '../components/Button'
import Prose from '../components/Prose'
import Loading from '../components/Loading'
import { routerPaths } from '../components/MailBallotManager'
import Text from '../components/Text'

const AddElectionScreen = () => {
  const history = useHistory()
  const { elections, addElection } = useContext(AppContext)
  const [electionName, setElectionName] = useState('')
  const [nameExists, setNameExists] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleElectionName: InputEventFunction = (event) => {
    setNameExists(false)
    const electionName = event.target.value
    const matchingElection = elections.find((e) => e.name === electionName)
    if (matchingElection) {
      setNameExists(true)
    } else {
    }
    setElectionName(electionName)
  }

  const handleCreateElection: FormEventFunction = async (event) => {
    event.preventDefault()
    setIsUploading(true)
    const { electionId } = await createElection({ name: electionName })
    const election = await getElection(electionId)
    addElection(election)
    history.push(routerPaths.election({ electionId }))
  }

  if (isUploading) {
    return (
      <MainChild center>
        <Loading isFullscreen>Creating election</Loading>
      </MainChild>
    )
  }
  return (
    <MainChild>
      <form onSubmit={handleCreateElection}>
        <Prose>
          <p>
            <label>
              {nameExists ? (
                <Text warning as="span">
                  Election Name “{electionName}” already exists.
                </Text>
              ) : (
                <React.Fragment>Election Name</React.Fragment>
              )}
              <br />
              <input
                ref={(input) => input && input.focus()}
                type="text"
                value={electionName}
                onChange={handleElectionName}
              />
            </label>
          </p>
          <p>
            <Button
              type="submit"
              // onPress={handleCreateElection}
              disabled={nameExists}
            >
              Create New Election
            </Button>
          </p>
        </Prose>
      </form>
    </MainChild>
  )
}

export default AddElectionScreen

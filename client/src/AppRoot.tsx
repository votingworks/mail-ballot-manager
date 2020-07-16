import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import AppContext from './contexts/AppContext'

import MailBallotManager, { routerPaths } from './components/MailBallotManager'
import {
  User,
  OptionalUser,
  Voters,
  MailElections,
  OptionalMailElections,
  VotersDictionary,
  ElectionDefinitionsDictionary,
} from './config/types'
import { getMailElections, getVoters, getElectionDefinition } from './api'

export interface AppStorage {
  user?: User
  mailElections: MailElections
  voters: Voters
}

const AppRoot = () => {
  const history = useHistory()
  const printAreaRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<OptionalUser>()
  const [mailElections, setMailElections] = useState<OptionalMailElections>()
  const [voters, setVoters] = useState<VotersDictionary>({})
  const [electionDefinitions, setElectionDefinitions] = useState<
    ElectionDefinitionsDictionary
  >({})

  const signOut = () => {
    setUser(undefined)
    setMailElections(undefined)
    setVoters({})
    history.push(routerPaths.root)
  }

  const loadMailElections = useCallback(async () => {
    try {
      const { mailElections } = await getMailElections()
      setMailElections(mailElections)
    } catch (error) {
      history.push(routerPaths.root)
      window.location.reload(false)
      console.error('getAndSetMailElections failed', error) // eslint-disable-line no-console
    }
  }, [history])

  useEffect(() => {
    loadMailElections()
  }, [loadMailElections])

  const loadVoters = useCallback(async () => {
    mailElections?.forEach(async (me) => {
      const { voters: newVoters } = await getVoters({ electionId: me.id })
      setVoters((v) => ({
        ...v,
        [me.id]: newVoters,
      }))
    })
  }, [mailElections])

  useEffect(() => {
    loadVoters()
  }, [loadVoters])

  const loadElectionDefinitions = useCallback(async () => {
    mailElections?.map(async (me) => {
      try {
        const newDefinition = await getElectionDefinition({ electionId: me.id })
        setElectionDefinitions((d) => ({
          ...d,
          [me.id]: newDefinition,
        }))
      } catch (error) {
        console.error(error)
      }
    })
  }, [mailElections])

  useEffect(() => {
    loadElectionDefinitions()
  }, [loadElectionDefinitions])

  return (
    <AppContext.Provider
      value={{
        electionDefinitions,
        mailElections,
        printAreaRef,
        setUser,
        setVoters,
        signOut,
        loadMailElections,
        loadVoters,
        user,
        voters,
      }}
    >
      <MailBallotManager />
      <div ref={printAreaRef} />
    </AppContext.Provider>
  )
}

export default AppRoot

import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import AppContext from './contexts/AppContext'

import MailBallotManager, { routerPaths } from './components/MailBallotManager'
import {
  User,
  OptionalUser,
  MailElection,
  Voters,
  MailElections,
  OptionalMailElections,
  VotersDictionary
} from './config/types'
import { getMailElections, getVoters } from './api'

export interface AppStorage {
  user?: User
  mailElections: MailElections
  voters: Voters
}

const AppRoot = () => {
  const history = useHistory()
  const printBallotRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<OptionalUser>()
  const [mailElections, setMailElections] = useState<OptionalMailElections>()
  const [voters, setVoters] = useState<VotersDictionary>({})

  const signOut = () => {
    setUser(undefined)
    setMailElections(undefined)
    setVoters({})
    history.push(routerPaths.root)
  }

  const addElection = (newElection: MailElection) => {
    const newElections = (mailElections || []).concat([newElection])
    setMailElections(newElections)
  }

  useEffect(() => {
    const getAndSetMailElections = async () => {
      try {
        const { mailElections } = await getMailElections()
        setMailElections(mailElections)
      } catch (error) {
        history.push(routerPaths.root)
        window.location.reload(false)
        console.error('getAndSetMailElections failed', error) // eslint-disable-line no-console
      }
    }
    getAndSetMailElections()
  }, [setMailElections, history, user])

  useEffect(() => {
    const getAndSetVoters = async () => {
      const updateVoters = async (electionId: string) => {
        const { voters: newVoters } = await getVoters({ electionId })
        setVoters(v => ({
          ...v,
          [electionId]: newVoters,
        }))
      }
      mailElections?.map(election => updateVoters(election.id))
    }
    getAndSetVoters()
  }, [setVoters, mailElections])

  return (
    <AppContext.Provider
      value={{
        addElection,
        mailElections,
        printBallotRef,
        setVoters,
        user,
        setUser,
        signOut,
        voters,
      }}
    >
      <MailBallotManager />
      <div ref={printBallotRef} />
    </AppContext.Provider>
  )
}

export default AppRoot

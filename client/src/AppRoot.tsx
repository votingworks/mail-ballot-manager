import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import AppContext from './contexts/AppContext'

import MailBallotManager, { routerPaths } from './components/MailBallotManager'
import { User, OptionalUser, MailElection, Voters, MailElections, OptionalMailElections, OptionalVoters } from './config/types'
import { getElections } from './api'

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
  const [voters, setVoters] = useState<OptionalVoters>()

  const signOut = () => {
    setUser(undefined)
    setMailElections(undefined)
    setVoters(undefined)
    history.push(routerPaths.root)
  }

  const addElection = (newElection: MailElection) => {
    const newElections = (mailElections || []).concat([newElection])
    setMailElections(newElections)
  }

  useEffect(() => {
    const getAndSetMailElections = async () => {
      const { mailElections } = await getElections()
      setMailElections(mailElections)
    }
    getAndSetMailElections()
  }, [setMailElections, user])

  return (
    <AppContext.Provider
      value={{
        addElection,
        mailElections,
        printBallotRef,
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

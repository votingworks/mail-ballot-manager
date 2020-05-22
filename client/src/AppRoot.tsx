import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import AppContext from './contexts/AppContext'

import { Storage } from './utils/Storage'

import MailBallotManager, { routerPaths } from './components/MailBallotManager'
import { User, OptionalUser, ElectionsListItem, Voters } from './config/types'

export interface AppStorage {
  user?: User
  elections: ElectionsListItem[]
  voters: Voters
}

export interface Props {
  storage: Storage<AppStorage>
}

export const userStorageKey = 'user'
export const electionsStorageKey = 'elections'
export const votersStorageKey = 'voters'

const defaultState = {
  user: undefined,
  elections: [],
  voters: [],
}

const AppRoot = ({ storage }: Props) => {
  const history = useHistory()
  const printBallotRef = useRef<HTMLDivElement>(null)

  const getUser = () => storage.get(userStorageKey)
  const getElections = () => storage.get(electionsStorageKey)
  const getVoters = () => storage.get(votersStorageKey)

  const [user, setUser] = useState(getUser())
  const [elections, setElections] = useState(
    getElections() || defaultState.elections
  )
  const [voters, setVoters] = useState(getVoters() || defaultState.voters)

  const signOut = () => {
    storage.clear()
    setUser(defaultState.user)
    setElections(defaultState.elections)
    setVoters(defaultState.voters)
    history.push(routerPaths.root)
  }

  const saveUser = (user: OptionalUser) => {
    setUser(user)
    user === undefined ? signOut() : storage.set(userStorageKey, user)
  }

  const saveElections = (newElections: ElectionsListItem[]) => {
    setElections(newElections)
    newElections === undefined
      ? storage.remove(electionsStorageKey)
      : storage.set(electionsStorageKey, newElections)
  }
  const addElection = (newElection: ElectionsListItem) => {
    const newElections = elections.concat([newElection])
    saveElections(newElections)
  }

  return (
    <AppContext.Provider
      value={{
        addElection,
        elections,
        printBallotRef,
        user,
        saveUser,
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

import { createContext, RefObject } from 'react'
import {
  ElectionsListItem,
  OptionalUser,
  SaveUser,
  Voters,
} from '../config/types'

interface AppContextInterface {
  addElection: (election: ElectionsListItem) => void
  elections: ElectionsListItem[]
  printBallotRef?: RefObject<HTMLElement>
  saveUser: SaveUser
  signOut: () => void
  user: OptionalUser
  voters: Voters
}

const appContext: AppContextInterface = {
  addElection: () => undefined,
  elections: [],
  printBallotRef: undefined,
  saveUser: () => undefined,
  signOut: () => undefined,
  user: undefined,
  voters: [],
}

const AppContext = createContext(appContext)

export const getElection = ({
  elections,
  electionId,
}: {
  elections: ElectionsListItem[]
  electionId: string
}) => elections.find((e) => e.id === electionId)!

export default AppContext

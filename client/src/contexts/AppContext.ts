import { createContext, RefObject } from 'react'
import {
  MailElection,
  OptionalUser,
  SetUser,
  MailElections,
  OptionalMailElections,
  OptionalVoters
} from '../config/types'

interface AppContextInterface {
  addElection: (election: MailElection) => void
  mailElections: OptionalMailElections
  printBallotRef?: RefObject<HTMLElement>
  setUser: SetUser
  signOut: () => void
  user: OptionalUser
  voters: OptionalVoters
}

const appContext: AppContextInterface = {
  addElection: () => undefined,
  mailElections: [],
  printBallotRef: undefined,
  setUser: () => undefined,
  signOut: () => undefined,
  user: undefined,
  voters: [],
}

const AppContext = createContext(appContext)

export const getElection = ({
  mailElections,
  electionId,
}: {
  mailElections: MailElections
  electionId: string
}) => mailElections.find((e) => e.id === electionId)!

export default AppContext

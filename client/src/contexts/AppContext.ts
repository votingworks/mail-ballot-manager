import { createContext, RefObject } from 'react'
import {
  MailElection,
  OptionalUser,
  SetUser,
  MailElections,
  OptionalMailElections,
  SetVoters,
  VotersDictionary
} from '../config/types'

interface AppContextInterface {
  addElection: (election: MailElection) => void
  setVoters: SetVoters
  mailElections: OptionalMailElections
  printBallotRef?: RefObject<HTMLElement>
  setUser: SetUser
  signOut: () => void
  user: OptionalUser
  voters: VotersDictionary
}

const appContext: AppContextInterface = {
  addElection: () => undefined,
  setVoters: () => undefined,
  mailElections: [],
  printBallotRef: undefined,
  setUser: () => undefined,
  signOut: () => undefined,
  user: undefined,
  voters: {},
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

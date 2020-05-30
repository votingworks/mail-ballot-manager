import { createContext, RefObject } from 'react'
import {
  OptionalUser,
  SetUser,
  MailElections,
  OptionalMailElections,
  SetVoters,
  VotersDictionary,
  ElectionDefinitionsDictionary
} from '../config/types'

interface AppContextInterface {
  electionDefinitions: ElectionDefinitionsDictionary
  setVoters: SetVoters
  mailElections: OptionalMailElections
  printBallotRef?: RefObject<HTMLElement>
  setUser: SetUser
  signOut: () => void
  loadMailElections: () => Promise<void>
  loadVoters: () => Promise<void>
  user: OptionalUser
  voters: VotersDictionary
}

const appContext: AppContextInterface = {
  electionDefinitions: {},
  setVoters: () => undefined,
  mailElections: [],
  printBallotRef: undefined,
  setUser: () => undefined,
  signOut: () => undefined,
  loadMailElections: async () => undefined,
  loadVoters: async () => undefined,
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

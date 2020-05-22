import { createContext, RefObject } from 'react'
import { MailElection, OptionalUser, SaveUser, Voters } from '../config/types'

interface AppContextInterface {
  addElection: (election: MailElection) => void
  elections: MailElection[]
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
  elections: MailElection[]
  electionId: string
}) => elections.find((e) => e.id === electionId)!

export default AppContext

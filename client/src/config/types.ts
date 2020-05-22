import {
  BallotStyle,
  Precinct,
  Election as ElectionDefinition,
} from '@votingworks/ballot-encoder'

// Events
export type InputEventFunction = (
  event: React.ChangeEvent<HTMLInputElement>
) => void | Promise<void>
export type ButtonEventFunction = (
  event: React.MouseEvent<HTMLButtonElement>
) => void | Promise<void>
export type FormEventFunction = (
  event: React.FormEvent<HTMLFormElement>
) => void | Promise<void>

// Router Props
export interface ElectionScreenProps {
  electionId: string
}
export interface VoterScreenProps extends ElectionScreenProps {
  voterId: string
}

// User
export interface User {
  email: string
}
export type OptionalUser = User | undefined
export type SaveUser = (value: OptionalUser) => void

// Voters

export interface Voter {
  id: string
  firstName: string
  middleName: string
  lastName: string
  nameSuffix: string
  street1: string
  street2: string
  city: string
  state: string
  zipcode: string
  ballotStyleId: string
  precinctId: string
  ballotFilepath?: string
  ballotCreated?: Date
  ballotPrinterReceived?: Date
  ballotPrinterPrinted?: Date
  ballotOutboundSent?: Date
  ballotOutboundDelivered?: Date
  ballotInboundSent?: Date
  ballotInboundDelivered?: Date
}
export type Voters = Voter[]

// Elections List

export interface BallotTemplate {
  fileName: string
  fileContent: File
  ballotStyle: BallotStyle
  precinct: Precinct
}

export interface ElectionsListItem {
  id: string // first 10 sha256
  name: string
  createdAt: string
  title?: string
  date?: string
  definition?: ElectionDefinition
  packageHash?: string
  approvedAt?: string
  approvedBy?: string
  ballotTemplates?: BallotTemplate[] // TODO: not optional
  voterCount?: number
}

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
  id: string
  email: string
}
export type OptionalUser = User | undefined
export type SetUser = React.Dispatch<React.SetStateAction<User | undefined>>

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
export type OptionalVoters = Voters | undefined

export interface VoterMailingListFile {
  id: string
  label: string
  fileName: string
  uploadedAt: string
  voterCount: number
}

// Elections List

export interface BallotTemplate {
  fileName: string
  fileContent: File
  ballotStyle: BallotStyle
  precinct: Precinct
}

export interface MailElection {
  id: string
  createdAt: string
  electionHash: string
  name: string
  electionTitle: string
  electionDate: string
  packageHash: string
  approvedAt?: string
  approvedBy?: string
  voterCount: number
  mailingListFiles?: VoterMailingListFile[]
  ballotBatches?: MailBallotBatch[]
}
export type MailElections = MailElection[]
export type OptionalMailElections = MailElections | undefined

export interface InsertsData {
  affidavit: string
  instructions: string
  helpPhone: string
  helpEmail: string
  helpWeb: string
  helpAddress: string
}

export interface MailBallotBatch {
  id: string
  label: string
  sentAt: string
  voterCount: number
}

import { Voters } from '../config/types'

export const getVoterById = (voterId: string, voters: Voters) =>
  voters.find((v) => v.id === voterId)!

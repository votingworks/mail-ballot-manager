import fetchJSON from './utils/fetchJSON'
import { ElectionsListItem } from './config/types'

const useFakeAPI = true

// temporary function
function sleep(ms: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const authenticateUser = async () => {
  if (useFakeAPI) {
    await sleep()
    return { email: 'beau@voting.works' }
  }
  // call Auth0
}

export const createElection = async (data: {
  electionName: string
}): Promise<{ electionId: string }> => {
  if (useFakeAPI) {
    await sleep()
    return {
      electionId: `uuid-${Date.now()}`, // This will be a UUID
    }
  }
  return await fetchJSON('/elections', {
    method: 'post',
    body: JSON.stringify(data),
  })
}

export const getElections = async () => {
  if (useFakeAPI) {
    await sleep()
    return {
      elections: [
        {
          electionId: 'asdf',
        },
      ],
    }
  }
  return await fetchJSON('/elections')
}

export const getElection = async (
  electionId: string
): Promise<ElectionsListItem> => {
  if (useFakeAPI) {
    return {
      id: electionId,
      name: 'foo',
      createdAt: new Date().toISOString(),
    }
  }
  return fetchJSON(`/elections/${electionId}`)
}

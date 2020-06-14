import React, { useContext } from 'react'
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useParams,
} from 'react-router-dom'

import { ElectionScreenProps, VoterScreenProps } from '../config/types'

import AppContext, { getElection } from '../contexts/AppContext'

import truncateString from '../utils/truncateString'

import Screen from './Screen'
import Main from './Main'
import Navigation, {
  exactPathActiveClassName,
  subPathActiveClassName,
} from './Navigation'
import Button from './Button'
import LinkButton from './LinkButton'

import AddElectionScreen from '../screens/AddElectionScreen'
import AuthenticationScreen from '../screens/AuthenticationScreen'
import InsertsEditScreen from '../screens/InsertsEditScreen'
import InsertOnDemandScreen from '../screens/InsertOnDemandScreen'
import VotersListScreen from '../screens/VotersListScreen'
import VoterBallotScreen from '../screens/VoterBallotScreen'
import ElectionsScreen from '../screens/ElectionsScreen'
import ElectionScreen from '../screens/ElectionScreen'
import EditElectionBallotPackageScreen from '../screens/EditElectionBallotPackageScreen'

export const routerPaths = {
  root: '/',
  elections: '/elections',
  electionsAdd: '/elections/add',
  election: ({ electionId }: ElectionScreenProps) => `/elections/${electionId}`,
  electionInsertsEdit: ({ electionId }: ElectionScreenProps) =>
    `/elections/${electionId}/inserts`,
  electionUploadBallotPackage: ({ electionId }: ElectionScreenProps) =>
    `/elections/${electionId}/package`,
  electionVoters: ({ electionId }: ElectionScreenProps) =>
    `/elections/${electionId}/voters`,
  voterBallot: ({ voterId, electionId }: VoterScreenProps) =>
    `/elections/${electionId}/voters/${voterId}/ballot`,
  export: '/elections/:electionId/export',
}

const MailBallotManager = () => {
  const location = useLocation()
  const { user, signOut, mailElections } = useContext(AppContext)

  const mainContent = () => {
    if (mailElections === undefined) {
      return null
    }
    if (mailElections.length) {
      return (
        <Switch>
          <Route exact path={routerPaths.elections}>
            <ElectionsScreen />
          </Route>
          <Route
            exact
            path={routerPaths.electionVoters({ electionId: ':electionId' })}
          >
            <VotersListScreen />
          </Route>
          <Route exact path={routerPaths.electionsAdd}>
            <AddElectionScreen />
          </Route>
          <Route
            exact
            path={routerPaths.electionUploadBallotPackage({
              electionId: ':electionId',
            })}
          >
            <EditElectionBallotPackageScreen />
          </Route>
          <Route
            exact
            path={routerPaths.electionInsertsEdit({
              electionId: ':electionId',
            })}
          >
            <InsertsEditScreen />
          </Route>
          <Route
            exact
            path={routerPaths.voterBallot({
              voterId: ':voterId',
              electionId: ':electionId',
            })}
          >
            <VoterBallotScreen />
          </Route>
          <Route
            exact
            path={routerPaths.election({ electionId: ':electionId' })}
          >
            <ElectionScreen />
          </Route>
          <Redirect
            exact
            path={routerPaths.election({ electionId: ':electionId' })}
            to={routerPaths.electionVoters({ electionId: ':electionId' })}
          />
          <Redirect path="/" to={routerPaths.elections} />
        </Switch>
      )
    }
    return <AddElectionScreen />
  }

  const ElectionNavigation = () => {
    const { electionId } = useParams()
    if (!mailElections || electionId === 'add') {
      return null
    }
    const { name } = getElection({ mailElections, electionId })
    return (
      <React.Fragment>
        <LinkButton
          to={routerPaths.election({ electionId })}
          className={exactPathActiveClassName({
            targetPath: routerPaths.election({ electionId }),
            currentPath: location.pathname,
          })}
        >
          {truncateString(name, 20)}
        </LinkButton>
        <LinkButton
          to={routerPaths.electionVoters({ electionId })}
          className={subPathActiveClassName({
            targetPath: routerPaths.electionVoters({ electionId }),
            currentPath: location.pathname,
          })}
        >
          Voters
        </LinkButton>
        <LinkButton
          to={routerPaths.electionInsertsEdit({ electionId })}
          className={subPathActiveClassName({
            targetPath: routerPaths.electionInsertsEdit({ electionId }),
            currentPath: location.pathname,
          })}
        >
          Inserts
        </LinkButton>
      </React.Fragment>
    )
  }

  if (user?.email) {
    return (
      <Screen>
        <Main padded>{mainContent()}</Main>
        <Navigation
          primaryNav={
            <Route path={routerPaths.election({ electionId: ':electionId' })}>
              <ElectionNavigation />
            </Route>
          }
          secondaryNav={
            <React.Fragment>
              <Route path={routerPaths.election({ electionId: ':electionId' })}>
                <LinkButton small to={routerPaths.root}>
                  Elections
                </LinkButton>
              </Route>{' '}
              <Button small onPress={signOut}>
                Sign Out
              </Button>
            </React.Fragment>
          }
        />
      </Screen>
    )
  } else {
    return (
      <Switch>
	<Route
	  exact
	  path="/insert-on-demand"
	>
	  <Screen>
            <Main padded>
	      <InsertOnDemandScreen />
	    </Main>
            <Navigation />
	  </Screen>
	</Route>
	<Route
	  exact
	  path="/"
	>
	  <AuthenticationScreen />
	</Route>
      </Switch>
    )
  }
}

export default MailBallotManager

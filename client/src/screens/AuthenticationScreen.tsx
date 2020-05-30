import React, { useContext, useState } from 'react'

import AppContext from '../contexts/AppContext'

import { authenticateUser } from '../api'

import Screen from '../components/Screen'
import Main, { MainChild } from '../components/Main'
import Button from '../components/Button'
import Navigation from '../components/Navigation'
import Loading from '../components/Loading'

const AuthenicationScreen = () => {
  const { setUser, loadMailElections } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const signIn = async () => {
    setLoading(true)
    const user = await authenticateUser()
    await loadMailElections()
    setUser(user)
  }

  return (
    <Screen>
      {loading ? (
        <Loading isFullscreen>Signing in</Loading>
      ) : (
          <Main padded>
            <MainChild>
              <Button onPress={signIn}>Sign In</Button>
            </MainChild>
          </Main>
        )}
      <Navigation />
    </Screen>
  )
}

export default AuthenicationScreen

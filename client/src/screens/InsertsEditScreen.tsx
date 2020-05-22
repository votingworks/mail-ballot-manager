import React from 'react'
import { useParams } from 'react-router-dom'
import Prose from '../components/Prose'
import { ElectionScreenProps } from '../config/types'

const InsertsEditScreen = () => {
  const { electionId } = useParams<ElectionScreenProps>()
  return (
    <Prose>
      <h1>InsertsEditScreen</h1>
      <p>electionId: {electionId}</p>
      <p>Edit and Preview Inserts UI will be here.</p>
    </Prose>
  )
}

export default InsertsEditScreen

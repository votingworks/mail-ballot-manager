import React, { useRef, useLayoutEffect, useContext, useState } from 'react'
import { Previewer } from 'pagedjs'

import AppContext from '../contexts/AppContext'
import Prose from '../components/Prose'
import MailInserts from '../components/MailInserts'
import Textarea from '../components/Textarea'

const insertDeclarationMarkdown = `
# Voter’s Declaration <small>I declare that…</small>

- I am qualified and registered to vote as the person named at the address listed below.
- I am voting in conformity with local and state election law.
- I have not applied, nor will I apply for a vote-by-mail ballot from any other jurisdiction in this election.
- I understand that knowingly making a false statement is a misdemeanor.

The below box must be signed or your vote will not be counted. **You must sign in your own handwriting. Power of attorney is not acceptable.** Your signature must match the signature on your voter registration card.
`
const insertInstructionsMarkdown = `
# Vote-By-Mail Instructions

Find contact information for your local election office by visiting **https://track.vote** in a web browser.

## 1. Mark Your Ballot

Use a black or blue pen pen to completely fill the oval to the left of your choices. If you make a mistake, contact your local election office for a new ballot.

## 2. Add Your Signature

Write your signature and the current date in the box above the return address.

## 3. Save Your Receipt

Separate your ballot receipt from the return label by tearing on the dotted line.

## 4. Insert Ballot and Return Label

Put your completed ballot and the return label in the return envelope. Make sure the mailing address is visible in the return envelope window.

## 5. Mail Your Ballot

Be sure to return your ballot on time.
`

const InsertsEditScreen = () => {
  const { printAreaRef } = useContext(AppContext)
  const insertsRef = useRef<HTMLDivElement>(null)

  const [declaration, setDeclaration] = useState(insertDeclarationMarkdown)
  const [instructions, setInstructions] = useState(insertInstructionsMarkdown)

  useLayoutEffect(() => {
    const printArea = printAreaRef?.current

    if (!printArea) {
      return
    }

    ;(async () => {
      const flow = await new Previewer().preview(
        insertsRef.current!.innerHTML,
        ['/inserts/inserts.css'],
        printArea
      )
      console.log('preview rendered, total pages', flow.total, { flow })
    })()

    return () => {
      printArea.innerHTML = ''
    }
  }, [printAreaRef])

  return (
    <React.Fragment>
      <Prose>
        <h1>Mail Ballot Inserts</h1>
        <p>
          Allowed markdown: b, em, h1, h2, h3, li, ol, p, small (use html tag as
          this is not supported in markdown), strong, ul
        </p>
      </Prose>
      <Textarea
        onChange={(e) => setInstructions(e.currentTarget.value)}
        value={instructions}
        resize={false}
      />
      <Textarea
        onChange={(e) => setDeclaration(e.currentTarget.value)}
        value={declaration}
        resize={false}
      />
      <div ref={insertsRef}>
        <MailInserts
          voterId={`123456`}
          voterFirstName={`Valentina`}
          voterMiddleName={`Q.`}
          voterLastName={`Voter`}
          voterNameSuffix={`Sr`}
          voterStreet1={`5678 Seventh Ave`}
          voterStreet2={`Apt 9863`}
          voterCity={`Franklin`}
          voterState={`HN`}
          voterZipCode={`99999-1278`}
          voterBallotStyleId={`77`}
          voterPrecinctId={`42`}
          voterAddressIMb={`FFTTDAADTTADTFDDFDDTFAFATDTDDFDAFDADDADDAFAAAFTTFTFDTFAAADADDDFDF`}
          jurisdictionAddressName={`Franklin County Elections Department`}
          jurisdictionAddressStreet1={`4321 Franklin Avenue`}
          jurisdictionAddressStreet2={``}
          jurisdictionAddressCity={`Franklin`}
          jurisdictionAddressState={`HN`}
          jurisdictionAddressZipCode={`99999-1234`}
          jurisdictionAddressIMb={`FFTTDAADTTADTFDDFDDTFAFATDTDDFDAFDADDADDAFAAAFTTFTFDTFAAADADDDFDF`}
          insertDeclarationMarkdown={declaration}
          insertInstructionsMarkdown={instructions}
        />
      </div>
    </React.Fragment>
  )
}

export default InsertsEditScreen

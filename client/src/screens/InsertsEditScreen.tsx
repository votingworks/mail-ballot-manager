import React, { useRef, useLayoutEffect, useContext, useState } from 'react'
import { Previewer } from 'pagedjs'

import AppContext from '../contexts/AppContext'
import Prose from '../components/Prose'
import MailInserts from '../components/MailInserts'
import Textarea from '../components/Textarea'

const insertLegalese = `
Penalties for vote fraud are up to five (5) years in prison and a fine of up to Five Thousand Dollars ($5,000.00). (Miss. Code, Ann. Section 23-15-753.) Penalties for voter intimidation are up to one (1) year in jail and a fine of up to One Thousand Dollars ($1,000.00). (Miss. Code. Ann. Section 97-13-37).

Notice to Absent Elector: Ballots personally cast in the registrar’s office must be cast no later than 12:00 noon on the Saturday immediately preceding elections held on Tue day, the Thursday immediately preceding elections held on Saturday, or the day immediately preceding the date of elections held on other days. If mailed the envelope and ballot must be received by 5:00 p.m. on the date preceding the election and immediately placed in the proper ballot box.
`

const insertDeclarationMarkdown = `
## Voter Affidavit

Under penalty of perjury, I do solemnly swear this ballot was marked by me indicating my choice of the candidates or propositions to be submitted at the election to be held on **November 3, 2020**, and I hereby authorize the registrar to place this envelope in the ballot box on my behalf, and I further authorize the election managers to place my ballot among the other ballots cast before such ballots are counted, and record my name on the poll list as if I were present in person and voted. I further swear that I marked this ballot in secret.
`

const insertDeclarationContinuedMarkdown = `
If you have obtained the enclosed ballot by reason of a temporary or permanent physical disability, you are not required to have the following certificate of attesting witness notarized, but it must be signed by a person eighteen (18) years of age or older.

## Certificate Of Attesting Witness

Under penalty of perjury I affirm that the above named voter personally appeared before me and is known by me to be the person named, and who, after being duly sworn or having affirmed,subscribed the foregoing oath or affirmation. That the voter exhibited to me their blank ballot; that the ballot was not marked or voted before the voter exhibited the ballot to me; that the voter was not solicited or advised by me to vote for any candidate, question or issue, and that the voter, after marking their ballot will place it in the return envelope, swear or affirm the voter affidavit, and will close and seal the return envelope in my presence.

---

Signature of attesting witness (for disabled voters) or signature of person authorized to administer oaths (for voters not appearing before the circuit clerk)

---

Address

---

Official Title, City, State

`
const insertCertificateOfVoterAssistance = `
## Certificate of Person Providing Voter Assistance

(To be completed only if the voter has received assistance in marking the enclosed ballot.)

I, under penalty of perjury, hereby certify that the above named voter declared to me that he or she is blind, temporarily or permanently physically disabled, or cannot read or write, and that the voter requested that I assist the voter in marking the enclosed absentee ballot. I hereby certify that the ballot preferences on the voter’s ballot are those communicated by the voter to me, and that I have marked the voter’s ballot in accordance with the voter’s instructions.

---

Signature / Printed Name (of person providing assistance)

---

Address

---

Date and time assistance provided / family relationship to voter (if any)
`
const insertInstructionsMarkdown = `
# How to Vote by Mail

Find contact information for your local election office by visiting **https://track.vote** in a web browser.

## 1. Mark Your Ballot

Use a dark pen to completely fill in the oval to the left of your choices. If you make a mistake, contact your local election office for a new ballot.

## 2. Add Signatures

Write your signature and the current date in the box above the return address. Have your witness sign and date as well. Your ballot will be rejected and not counted if it is not signed by you and an attesting witness.

## 3. Save Your Receipt

Separate your ballot receipt from the return label by tearing on the dotted line.

## 4. Return Your Ballot

Place your completed ballot and the return label in the return envelope. Make sure the mailing address is visible in the return envelope window. Seal the envelope and place it in the mail. Be sure to return your ballot on time.

**Notice to Absent Elector:** Ballots personally cast in the registrar’s office must be cast no later than 12:00 noon on the Saturday immediately preceding elections held on Tue day, the Thursday immediately preceding elections held on Saturday, or the  day immediately preceding the date of elections held on other days. If mailed the envelope and ballot must be received by 5:00 p.m. on the date preceding the election and immediately placed in the propoer ballot box.
`

// ## 4. Place Ballot and Return Label in Return Envelope

// Place your completed ballot and the return label in the return envelope. Make sure the mailing address is visible in the return envelope window.

// ## 5. Mail Your Ballot

// Be sure to return your ballot on time.

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
          insertDeclarationContinuedMarkdown={
            insertDeclarationContinuedMarkdown
          }
          insertInstructionsMarkdown={instructions}
        />
      </div>
    </React.Fragment>
  )
}

export default InsertsEditScreen

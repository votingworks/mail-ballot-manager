import React, { useRef, useLayoutEffect, useContext } from 'react'
import { Previewer } from 'pagedjs'

import AppContext from '../contexts/AppContext'
import Prose from '../components/Prose'
import MailInserts from '../components/MailInserts'

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

1Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

1. Eu mi bibendum neque egestas congue quisque egestas diam.
2. Tempus quam pellentesque nec nam aliquam sem et.
3. Egestas purus viverra accumsan in nisl nisi. Nulla malesuada pellentesque elit eget gravida cum.
4. Lobortis mattis aliquam faucibus purus in massa tempor nec. Adipiscing enim eu turpis egestas pretium aenean pharetra magna.
5. Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Erat nam at lectus urna duis convallis.

2Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc mattis enim ut tellus elementum. In iaculis nunc sed augue lacus viverra vitae. Sed augue lacus viverra vitae congue eu consequat ac. Accumsan lacus vel facilisis volutpat est. Purus sit amet volutpat consequat mauris. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas.

3Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc mattis enim ut tellus elementum. In iaculis nunc sed augue lacus viverra vitae. Sed augue lacus viverra vitae congue eu consequat ac. Accumsan lacus vel facilisis volutpat est. Purus sit amet volutpat consequat mauris. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas.

4Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc mattis enim ut tellus elementum. In iaculis nunc sed augue lacus viverra vitae. Sed augue lacus viverra vitae congue eu consequat ac. Accumsan lacus vel facilisis volutpat est. Purus sit amet volutpat consequat mauris. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas.

5Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc mattis enim ut tellus elementum. In iaculis nunc sed augue lacus viverra vitae. Sed augue lacus viverra vitae congue eu consequat ac. Accumsan lacus vel facilisis volutpat est. Purus sit amet volutpat consequat mauris. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas.

6Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc mattis enim ut tellus elementum. In iaculis nunc sed augue lacus viverra vitae. Sed augue lacus viverra vitae congue eu consequat ac. Accumsan lacus vel facilisis volutpat est. Purus sit amet volutpat consequat mauris. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas.
`

const InsertsEditScreen = () => {
  const { printAreaRef } = useContext(AppContext)

  const insertsRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const printArea = printAreaRef?.current

    if (!printArea) {
      return
    }

    ; (async () => {
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
  }, [
    printAreaRef,
  ])

  return (
    <React.Fragment>
      <Prose>
        <h1>Mail Ballot Inserts</h1>
      </Prose>
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
          insertDeclarationMarkdown={insertDeclarationMarkdown}
          insertInstructionsMarkdown={insertInstructionsMarkdown}
        />
      </div>
    </React.Fragment>
  )
}

export default InsertsEditScreen

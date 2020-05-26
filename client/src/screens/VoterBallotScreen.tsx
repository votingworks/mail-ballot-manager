import React from 'react'

const VoterBallotScreen = () => (
  <div>
    <h1>VoterBallotScreen</h1>
  </div>
)

export default VoterBallotScreen

// import React, { useContext } from 'react'
// import { useParams } from 'react-router-dom'
// import { getPrecinctById } from '@votingworks/ballot-encoder'
// import styled from 'styled-components'

// import { VoterScreenProps } from '../config/types'
// import AppContext from '../contexts/AppContext'

// import Prose from '../components/Prose'
// import { getVoterById } from '../utils/voterMailingList'
// import { MainChild } from '../components/Main'

// const VoterInfoList = styled.dl`
//   & > dt {
//     font-weight: bold;
//     font-size: 0.6em;
//     text-transform: uppercase;
//   }
//   & > dd {
//     margin: 0;
//   }
//   & > dd + dt {
//     margin-top: 1rem;
//   }
// `

// const BallotScreen = () => {
//   const { voterId, electionId } = useParams<VoterScreenProps>()
//   const { elections, voters } = useContext(AppContext)
//   const election = elections.find((e) => e.id === electionId)?.definition!
//   const {
//     ballotCreated,
//     ballotInboundDelivered,
//     ballotInboundSent,
//     ballotOutboundDelivered,
//     ballotOutboundSent,
//     ballotPrinterPrinted,
//     ballotPrinterReceived,
//     ballotStyleId,
//     city,
//     firstName,
//     id,
//     lastName,
//     middleName,
//     nameSuffix,
//     precinctId,
//     state,
//     street1,
//     street2,
//     zipcode,
//   } = getVoterById(voterId, voters!)
//   // console.log({ voter, voters, voterId })
//   const precinctName = getPrecinctById({ election, precinctId })?.name
//   return (
//     <React.Fragment>
//       <MainChild>
//         <Prose>
//           <h1>View Ballot</h1>
//           <VoterInfoList>
//             <dt>Voter ID</dt>
//             <dd>{id}</dd>
//             <dt>Mailing Address</dt>
//             <dd>
//               {firstName} {middleName} {lastName}
//               {nameSuffix && `, ${nameSuffix}`}
//               <br />
//               {street1}
//               {street2 && `, ${street2}`},
//               <br />
//               {city}, {state} {zipcode}
//             </dd>
//             <dt>Ballot Style</dt>
//             <dd>{ballotStyleId}</dd>
//             <dt>Precinct</dt>
//             <dd>{precinctName}</dd>
//             <dt>Status</dt>
//             <dd>
//               <input type="checkbox" checked={!!ballotCreated} readOnly />{' '}
//               ballotCreated
//               <br />
//               <input
//                 type="checkbox"
//                 checked={!!ballotPrinterReceived}
//                 readOnly
//               />{' '}
//               ballotPrinterReceived
//               <br />
//               <input
//                 type="checkbox"
//                 checked={!!ballotPrinterPrinted}
//                 readOnly
//               />{' '}
//               ballotPrinterPrinted
//               <br />
//               <input
//                 type="checkbox"
//                 checked={!!ballotOutboundSent}
//                 readOnly
//               />{' '}
//               ballotOutboundSent
//               <br />
//               <input
//                 type="checkbox"
//                 checked={!!ballotOutboundDelivered}
//                 readOnly
//               />{' '}
//               ballotOutboundDelivered
//               <br />
//               <input
//                 type="checkbox"
//                 checked={!!ballotInboundSent}
//                 readOnly
//               />{' '}
//               ballotInboundSent
//               <br />
//               <input
//                 type="checkbox"
//                 checked={!!ballotInboundDelivered}
//                 readOnly
//               />{' '}
//               ballotInboundDelivered
//             </dd>
//           </VoterInfoList>
//         </Prose>
//         <embed
//           src="/demo-ballot.pdf"
//           width="100%"
//           height="1024"
//           // pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"
//         ></embed>
//       </MainChild>
//     </React.Fragment>
//   )
// }

// export default BallotScreen

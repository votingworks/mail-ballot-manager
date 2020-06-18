import styled from 'styled-components'

interface Props {
  resize: boolean
}

const Textarea = styled.textarea<Props>`
  width: 100%;
  min-height: 300px;
  resize: ${({ resize = true }) => (resize ? undefined : 'none')};
  padding: 0.25rem;
  font-size: 0.5rem;
  border: 2px solid #333333;
  font-family: monospace;
`

export default Textarea

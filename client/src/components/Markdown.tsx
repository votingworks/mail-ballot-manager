import React from 'react'
import marked from 'marked'
import DOMPurify from 'dompurify'
import styled from 'styled-components'

import Prose from './Prose'

var renderer = new marked.Renderer()

// Override link method.
// Do Not Autolink URLs. Link URLS are not sanitized.
// Source method: https://github.com/markedjs/marked/blob/master/src/Renderer.js#L134-L145
renderer.link = function (href: string, title: string, text: string) {
  if (href === text) {
    return href
  }
  return `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`
}

const ErrorList = styled.dl`
  margin-bottom: 2em;
  color: red;
  dt {
    font-weight: bold;
  }
  dd {
    margin: 0 0 1em 1rem;
  }
`

interface Props {
  ALLOWED_TAGS?: string[]
  children: string
  maxWidth?: boolean
}

const Markdown = ({
  ALLOWED_TAGS = [
    'b',
    'em',
    'h1',
    'h2',
    'h3',
    'li',
    'ol',
    'p',
    'small',
    'strong',
    'ul',
    'hr',
  ],
  children,
  maxWidth,
}: Props) => {
  const htmlContent = marked(children, { renderer })
  const cleanHHtmContent = DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS })
  const removed = DOMPurify.removed
    .map((item, index) => ({
      index,
      tagName: item.element.tagName.toLowerCase(),
      outerHTML: item.element.outerHTML,
    }))
    .filter((item) => item.tagName !== 'body')
  return (
    <React.Fragment>
      {removed.length !== 0 && (
        <ErrorList>
          {removed.map(({ index, tagName, outerHTML }) => (
            <React.Fragment key={index}>
              <dt>
                Disallowed tag <code>{tagName}</code> removed. Tag found in:
              </dt>
              <dd>
                <code>{outerHTML}</code>
              </dd>
            </React.Fragment>
          ))}
        </ErrorList>
      )}
      <Prose
        maxWidth={maxWidth}
        dangerouslySetInnerHTML={{ __html: cleanHHtmContent }}
      />
    </React.Fragment>
  )
}

export default Markdown

import React from "react"
import showdown from "showdown"
import parseHTML from "html-react-parser"
import * as DOMPurify from "dompurify"

import styles from "./Markdown.module.scss"

const converter = new showdown.Converter()
converter.setFlavor("github")

type Props = {
  content?: string
}

export const Markdown: React.FC<Props> = ({ content = "" }) => {
  const dirtyHTML = converter.makeHtml(content)
  const cleanHTML = DOMPurify.sanitize(dirtyHTML, { USE_PROFILES: { html: true } })

  return <div className={styles.markdown}>{parseHTML(cleanHTML)}</div>
}

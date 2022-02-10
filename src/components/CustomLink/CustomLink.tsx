import React from "react"
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import type { LinkProps } from "react-router-dom"
import styles from "./CustomLink.module.scss"

const CustomLink = ({ children, to, ...props }: LinkProps) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <Link className={match ? styles.active : undefined} to={to} {...props}>
      {children}
    </Link>
  )
}
export default CustomLink

import React, { PropsWithChildren } from "react"

import styles from "./Title.module.scss"

type TitleVariant = "h1" | "h2" | "h3"

type TitleProps = {
  variant?: TitleVariant
}

export const Title: React.FC<PropsWithChildren<TitleProps>> = ({ variant = "h1", children }) => {
  return React.createElement(variant, { className: styles.title }, children)
}

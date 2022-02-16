import React from "react"
import cx from "classnames"

import styles from "./Layout.module.scss"
import { DOMAttributes } from "react"

type FlexboxAlignment = "start" | "end" | "center" | "space-between" | "space-around"

type Spacing = "xs" | "s" | "m" | "l" | "xl"

type FlexboxProps = {
  grow?: number
  shrink?: number
  /**
   * Alignment might be a single value, or an array.
   * An array is provided when items need to be aligned in both axis.
   */
  alignment?: FlexboxAlignment | FlexboxAlignment[]
  spacing?: Spacing
  className?: string
} & DOMAttributes<HTMLDivElement>

export const Column: React.FC<FlexboxProps> = ({ children, ...props }) => {
  return (
    <FlexboxElement direction="column" {...props}>
      {children}
    </FlexboxElement>
  )
}

export const Row: React.FC<FlexboxProps> = ({ children, ...props }) => {
  return (
    <FlexboxElement direction="row" {...props}>
      {children}
    </FlexboxElement>
  )
}

const FlexboxElement: React.FC<FlexboxProps & { direction: "row" | "column" }> = ({
  children,
  direction,
  grow,
  shrink,
  alignment,
  spacing,
  className,
  ...props
}) => {
  const [alignItemsIndex, justifyContentIndex] = direction === "row" ? [1, 0] : [0, 1]
  const alignments = Array.isArray(alignment) ? alignment : [alignment]
  const alignItems = alignments.at(alignItemsIndex)
  const justifyContent = alignments.at(justifyContentIndex)

  return (
    <div
      className={cx(styles.layout, styles[direction], className, {
        [styles[`spacing-${spacing}`]]: spacing,
      })}
      style={{ flexGrow: grow, flexShrink: shrink, alignItems: alignItems, justifyContent: justifyContent }}
      {...props}
    >
      {children}
    </div>
  )
}

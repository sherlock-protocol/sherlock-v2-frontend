import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Table.module.scss"

type TableSize = "small" | "regular"

export const Table: React.FC<
  PropsWithChildren<
    React.TableHTMLAttributes<HTMLTableElement> & {
      selectable?: boolean
      size?: TableSize
    }
  >
> = ({ children, selectable = true, size = "regular", className, ...props }) => (
  <table
    className={cx(styles.table, className, { [styles.selectable]: selectable, [styles.small]: size === "small" })}
    {...props}
  >
    {children}
  </table>
)

export const THead: React.FC<PropsWithChildren<React.TableHTMLAttributes<HTMLTableSectionElement>>> = ({
  children,
  ...props
}) => (
  <thead className={styles.thead} {...props}>
    {children}
  </thead>
)

export const TBody: React.FC<PropsWithChildren<React.TableHTMLAttributes<HTMLTableSectionElement>>> = ({
  children,
  ...props
}) => (
  <tbody className={styles.tbody} {...props}>
    {children}
  </tbody>
)

export const Tr: React.FC<PropsWithChildren<React.TableHTMLAttributes<HTMLTableRowElement>>> = ({
  children,
  className,
  ...props
}) => (
  <tr className={cx(styles.tr, className)} {...props}>
    {children}
  </tr>
)

export const Th: React.FC<PropsWithChildren<React.TableHTMLAttributes<HTMLTableCellElement>>> = ({
  children,
  ...props
}) => (
  <th className={styles.th} {...props}>
    {children}
  </th>
)

export const Td: React.FC<PropsWithChildren<React.TableHTMLAttributes<HTMLTableCellElement>>> = ({
  children,
  className,
  ...props
}) => (
  <td className={cx(styles.td, className)} {...props}>
    {children}
  </td>
)

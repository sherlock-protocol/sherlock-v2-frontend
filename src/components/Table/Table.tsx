import React, { PropsWithChildren } from "react"
import cx from "classnames"

import styles from "./Table.module.scss"

export const Table: React.FC<PropsWithChildren<React.TableHTMLAttributes<HTMLTableElement>>> = ({
  children,
  ...props
}) => (
  <table className={styles.table} {...props}>
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
  ...props
}) => (
  <td className={styles.td} {...props}>
    {children}
  </td>
)

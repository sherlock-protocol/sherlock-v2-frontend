import React from "react"
import cx from "classnames"

import styles from "./Button.module.scss"
import { BigNumber } from "ethers"
import ConnectGate from "../ConnectGate/ConnectGate"
import AllowanceGate from "../AllowanceGate/AllowanceGate"

type ButtonVariant = "primary" | "secondary" | "alternate" | "cta"

type Allowance = {
  spender: string
  amount: BigNumber
}

export type ButtonProps = {
  /**
   * On Click event handler
   */
  onClick?: (e: React.SyntheticEvent) => void

  /**
   * If button should not be interactible
   */
  disabled?: boolean

  /**
   * Button variant (@see ButtonVariant)
   */
  variant?: ButtonVariant

  /**
   * Wether the action requires to have a connected account or not.
   * `ConnectGate` HOC will be used.
   */
  requiresConnected?: boolean

  /**
   * Wether the action requires certain allowance.
   * `AllowanceGate` HOC will be used.
   */
  allowance?: Allowance
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  requiresConnected = false,
  allowance,
}) => {
  const ConnectGateOrEmptyFragment = requiresConnected ? ConnectGate : React.Fragment
  const AllowanceGateOrEmptyFragment: React.FC = allowance
    ? (children) => (
        <AllowanceGate spender={allowance.spender} amount={allowance.amount}>
          {children}
        </AllowanceGate>
      )
    : React.Fragment

  const button = (
    <button className={cx(styles.button, styles[variant])} onClick={onClick} disabled={disabled}>
      <div className={styles.content}>{children}</div>
    </button>
  )

  return disabled ? (
    button
  ) : (
    <ConnectGateOrEmptyFragment>
      <AllowanceGateOrEmptyFragment>{button}</AllowanceGateOrEmptyFragment>
    </ConnectGateOrEmptyFragment>
  )
}

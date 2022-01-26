import React from "react"

type ButtonProps = {}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button>{children}</button>
}

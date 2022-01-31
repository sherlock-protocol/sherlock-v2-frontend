import React from "react"

type ButtonProps = {
  onClick: (e: React.SyntheticEvent) => void
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

import { createContext, PropsWithChildren, useContext, useMemo } from "react"
import { useSignInWithEthereum } from "../useSignInWithEthereum"
import { Auditor } from "./auditors"

type AuthenticationContextType = {
  isLoading: boolean
  isError: boolean
  isAuthenticated: boolean
  auditor?: Auditor
  authenticate: () => Promise<void>
}

const AuthenticationContext = createContext<AuthenticationContextType>({} as AuthenticationContextType)

export const useAuthentication = () => useContext(AuthenticationContext)

export const AuthenticationContextProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { signIn, isLoading, auditor } = useSignInWithEthereum()

  const ctx = useMemo(
    () => ({
      isLoading,
      isError: false,
      isAuthenticated: !!auditor,
      auditor,
      authenticate: signIn,
    }),
    [signIn, isLoading, auditor]
  )
  return <AuthenticationContext.Provider value={ctx}>{children}</AuthenticationContext.Provider>
}

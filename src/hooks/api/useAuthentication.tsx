import { createContext, PropsWithChildren, useContext, useMemo } from "react"
import { useSignInWithEthereum } from "../useSignInWithEthereum"

type AuthenticationContextType = {
  isLoading: boolean
  isError: boolean
  isAuthenticated: boolean
  signature?: string
  authenticate: () => Promise<void>
}

const AuthenticationContext = createContext<AuthenticationContextType>({} as AuthenticationContextType)

export const useAuthentication = () => useContext(AuthenticationContext)

export const AuthenticationContextProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { signIn, isLoading, signature } = useSignInWithEthereum()

  const ctx = useMemo(
    () => ({
      isLoading,
      isError: false,
      isAuthenticated: !!signature,
      authenticate: signIn,
    }),
    [signIn, isLoading, signature]
  )
  return <AuthenticationContext.Provider value={ctx}>{children}</AuthenticationContext.Provider>
}

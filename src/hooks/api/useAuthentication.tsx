import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from "react"
import { useSignInWithEthereum } from "../useSignInWithEthereum"
import { AuditorProfile } from "./auditors/index"
import { useProfile } from "./auditors"
import { useSignOut } from "./auditors/useSignOut"

type AuthenticationContextType = {
  isLoading: boolean
  isError: boolean
  isAuthenticated: boolean
  signature?: string
  authenticate: () => Promise<void>
  signOut: () => void
  profile?: AuditorProfile
  status: "error" | "idle" | "loading" | "success"
}

const AuthenticationContext = createContext<AuthenticationContextType>({} as AuthenticationContextType)

export const useAuthentication = () => useContext(AuthenticationContext)

export const AuthenticationContextProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { signIn, isLoading, signature } = useSignInWithEthereum()
  const { signOut } = useSignOut()

  const { data: authenticatedProfile, isLoading: profileIsLoading, refetch, isError, status } = useProfile()

  const ctx = useMemo(
    () => ({
      isLoading: isLoading || profileIsLoading,
      isError,
      isAuthenticated: !!authenticatedProfile,
      authenticate: signIn,
      signOut,
      profile: authenticatedProfile,
      status,
    }),
    [signIn, isLoading, signOut, authenticatedProfile, isError, profileIsLoading, status]
  )
  return <AuthenticationContext.Provider value={ctx}>{children}</AuthenticationContext.Provider>
}

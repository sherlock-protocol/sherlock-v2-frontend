import React, { PropsWithChildren, useCallback, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAccount } from "wagmi"
import { useProfile } from "../../hooks/api/auditors"
import { useSignOut } from "../../hooks/api/auditors/useSignOut"
import { useAuthentication } from "../../hooks/api/useAuthentication"
import { Route } from "../../utils/routes"
import { Box } from "../Box"
import { Button } from "../Button"
import { Column } from "../Layout"
import LoadingContainer from "../LoadingContainer/LoadingContainer"
import { Text } from "../Text"
import { Title } from "../Title"

type Props = {
  redirectRoute?: Route
}

export const AuthenticationGate: React.FC<PropsWithChildren<Props>> = ({ children, redirectRoute = "/" }) => {
  const { address: connectedAddress } = useAccount()
  const { authenticate, isLoading: authenticationIsLoading } = useAuthentication()
  const { data: authenticatedProfile, isFetched, isLoading: profileIsLoading } = useProfile()
  const { signOut } = useSignOut()

  const addressIsAllowed = useCallback(
    (address: string) => authenticatedProfile?.addresses.some((a) => a.address === address),
    [authenticatedProfile]
  )

  useEffect(() => {
    if (connectedAddress && authenticatedProfile && !addressIsAllowed(connectedAddress)) {
      signOut()
    }
  }, [connectedAddress, addressIsAllowed, signOut, authenticatedProfile])

  const isLoading = authenticationIsLoading || profileIsLoading
  if (authenticatedProfile) return <>{children}</>
  if (isFetched && !authenticatedProfile && !isLoading) return <Navigate to={redirectRoute} replace />

  return (
    <LoadingContainer loading={isLoading}>
      <Box>
        <Column spacing="l">
          <Title>Sign in required</Title>
          <Text>You need to sign in to get access to this section.</Text>
          <Button onClick={authenticate}>Sign in</Button>
        </Column>
      </Box>
    </LoadingContainer>
  )
}

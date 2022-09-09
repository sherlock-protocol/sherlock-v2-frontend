import React, { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { useAccount } from "wagmi"
import { useIsAuditor } from "../../hooks/api/auditors"
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
  const { isAuthenticated, authenticate, isLoading } = useAuthentication()
  const { address: connectedAddress } = useAccount()
  const { data: isAuditor, isStale } = useIsAuditor(connectedAddress)

  if (isAuthenticated) return <>{children}</>
  if (isStale && !isAuditor) return <Navigate to={redirectRoute} replace />

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

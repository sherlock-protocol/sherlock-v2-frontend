import React, { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { useProfile } from "../../hooks/api/auditors"
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
  const { authenticate, isLoading: authenticationIsLoading } = useAuthentication()
  const { data: authenticatedProfile, isFetched, isLoading: profileIsLoading } = useProfile()

  if (authenticatedProfile) return <>{children}</>
  if (isFetched && !authenticatedProfile) return <Navigate to={redirectRoute} replace />

  return (
    <LoadingContainer loading={authenticationIsLoading || profileIsLoading}>
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

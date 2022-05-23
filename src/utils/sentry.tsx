import * as Sentry from "@sentry/react"
import { FallbackRender } from "@sentry/react/dist/errorboundary"
import { BrowserTracing } from "@sentry/tracing"
import { PropsWithChildren } from "react"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.01,
  release: process.env.REACT_APP_VERSION,
})

export const setUser: typeof Sentry.setUser = Sentry.setUser

export const captureException: typeof Sentry.captureException = Sentry.captureException

export const addTransactionBreadcrumb = (data: Record<string, any>) =>
  Sentry.addBreadcrumb({
    category: "Transaction",
    level: Sentry.Severity.Info,
    data,
  })

const ErrorBoundaryComponent: FallbackRender = (props) => <ErrorBoundary {...props} />

export const SentryErrorBoundary: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Sentry.ErrorBoundary fallback={ErrorBoundaryComponent}>{children}</Sentry.ErrorBoundary>
)

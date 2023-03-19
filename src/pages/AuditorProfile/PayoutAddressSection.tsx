import { ethers } from "ethers"
import React, { useCallback, useEffect, useState } from "react"
import { FaTimes, FaCheck, FaExternalLinkAlt } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors/useProfile"
import { useUpdateProfile } from "../../hooks/api/auditors/useUpdateProfile"
import { getAddressUrl } from "../../utils/explorer"
import { Field } from "../Claim/Field"
import { ErrorModal } from "../ContestDetails/ErrorModal"
import styles from "./AuditorProfile.module.scss"

type Props = {
  disabled?: boolean
}

export const PayoutAddressSection: React.FC<Props> = ({ disabled }) => {
  const { data: profile } = useProfile()
  const { update, isLoading, isSuccess, isError, error, reset } = useUpdateProfile()
  const [payoutAddress, setPayoutAddress] = useState<string>(profile?.payoutAddress ?? "")

  /**
   * Update input fields whenever the profile changes.
   */
  useEffect(() => {
    setPayoutAddress(profile?.payoutAddress ?? "")
  }, [profile])

  const handleCancelClick = useCallback(() => {
    if (!profile) return

    setPayoutAddress(profile.payoutAddress)
  }, [setPayoutAddress, profile])

  const handleConfirmClick = useCallback(() => {
    payoutAddress && update({ payoutAddress })
  }, [payoutAddress, update])

  const handleErrorModalClose = useCallback(() => {
    reset()
  }, [reset])

  const handleExplorerClick = useCallback(() => {
    window.open(getAddressUrl(payoutAddress), "__blank")
  }, [payoutAddress])

  if (!profile) return null

  const isDirty = profile.payoutAddress !== payoutAddress

  const addressIsValid = ethers.utils.isAddress(payoutAddress) && payoutAddress !== ethers.constants.AddressZero

  return (
    <Box shadow={false} fullWidth disabled={disabled}>
      <Column spacing="xs">
        <Row alignment={["start", "baseline"]} spacing="m">
          <Title variant="h2">Payout address</Title>
          {isSuccess && (
            <Text size="small" variant="secondary">
              Updated!
            </Text>
          )}
        </Row>
        <Row>
          <Text variant="secondary" size="small">
            (Ethereum Mainnet)
          </Text>
        </Row>
      </Column>
      <Table selectable={false}>
        <TBody>
          <Tr>
            <Td className={styles.payoutAddressColumn}>
              <Field error={!addressIsValid} errorMessage="This is not a valid address">
                <Input variant="secondary" value={payoutAddress} onChange={setPayoutAddress} textVariant="mono" />
              </Field>
            </Td>
            <Td>
              <Button variant="secondary" size="small" onClick={handleExplorerClick}>
                <FaExternalLinkAlt />
              </Button>
            </Td>
          </Tr>
        </TBody>
      </Table>
      {isDirty && (
        <Row spacing="s" alignment={["end", "baseline"]}>
          {isLoading && (
            <Text size="small" variant="secondary">
              Updating ...
            </Text>
          )}
          <Button size="small" variant="secondary" disabled={!isDirty || isLoading} onClick={handleCancelClick}>
            <FaTimes />
          </Button>
          <Button
            size="small"
            variant="primary"
            disabled={!isDirty || !addressIsValid || isLoading}
            onClick={handleConfirmClick}
          >
            <FaCheck />
          </Button>
        </Row>
      )}
      {isError && <ErrorModal reason={error.message} onClose={handleErrorModalClose} />}
    </Box>
  )
}

import { ethers } from "ethers"
import React, { useCallback, useEffect, useState } from "react"
import { FaTimes, FaCheck, FaEdit } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors"
import { Field } from "../Claim/Field"
import styles from "./AuditorProfile.module.scss"

export const PayoutAddressSection = () => {
  const { data: profile } = useProfile()
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

  if (!profile) return null

  const isDirty = profile.payoutAddress !== payoutAddress

  const addressIsValid = ethers.utils.isAddress(payoutAddress) && payoutAddress !== ethers.constants.AddressZero

  return (
    <Box shadow={false}>
      <Title variant="h2">Payout address</Title>
      <Table selectable={false}>
        <TBody>
          <Tr>
            <Td className={styles.payoutAddressColumn}>
              <Field error={!addressIsValid} errorMessage="This is not a valid address">
                <Input variant="secondary" value={payoutAddress} onChange={setPayoutAddress} />
              </Field>
            </Td>
            <Td>
              <Row spacing="s">
                <Button
                  size="small"
                  variant="secondary"
                  disabled={!isDirty || !addressIsValid}
                  onClick={handleCancelClick}
                >
                  <FaTimes />
                </Button>
                <Button size="small" variant="primary" disabled={!isDirty || !addressIsValid}>
                  <FaCheck />
                </Button>
              </Row>
            </Td>
          </Tr>
        </TBody>
      </Table>
    </Box>
  )
}

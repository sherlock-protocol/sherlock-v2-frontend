import { ethers } from "ethers"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FaTrash, FaPlusSquare } from "react-icons/fa"
import { useAccount } from "wagmi"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Row } from "../../components/Layout"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors"
import { useUpdateProfile } from "../../hooks/api/auditors/useUpdateProfile"
import { Field } from "../Claim/Field"
import { ErrorModal } from "../ContestDetails/ErrorModal"

import styles from "./AuditorProfile.module.scss"

export const AddressesSection = () => {
  const { address: connectedAddress } = useAccount()
  const { data: profile } = useProfile()
  const { update, isLoading, isSuccess, isError, error, reset } = useUpdateProfile()
  const [addresses, setAddresses] = useState<string[]>(profile?.addresses.map((a) => a.address) ?? [])
  const [newAddress, setNewAddress] = useState("")

  useEffect(() => {
    setAddresses(profile?.addresses.map((a) => a.address) ?? [])
  }, [profile, setAddresses])

  /**
   * Clear new address input if update was successful
   */
  useEffect(() => {
    if (isSuccess) {
      setNewAddress("")
    }
  }, [isSuccess, setNewAddress])

  const addressIsValid = useMemo(
    () => ethers.utils.isAddress(newAddress) && newAddress !== ethers.constants.AddressZero,
    [newAddress]
  )

  const handleAddNewAddress = useCallback(() => {
    if (!addressIsValid) return
    update({
      addresses: [...addresses, newAddress],
    })
  }, [update, addresses, addressIsValid, newAddress])

  const handleRemoveAddress = useCallback(
    (address: string) => {
      if (address === connectedAddress) return

      update({
        addresses: addresses.filter((a) => a !== address),
      })
    },
    [addresses, update, connectedAddress]
  )

  const handleErrorModalClose = useCallback(() => {
    reset()
  }, [reset])

  if (!profile) return null

  return (
    <Box shadow={false}>
      <Row alignment={["start", "baseline"]} spacing="m">
        <Title variant="h2">Authentication addresses</Title>
        {isLoading && (
          <Text size="small" variant="secondary">
            Updating ...
          </Text>
        )}
        {isSuccess && (
          <Text size="small" variant="secondary">
            Updated!
          </Text>
        )}
      </Row>
      <Table selectable={false}>
        <TBody>
          {addresses.map((address) => (
            <Tr key={address}>
              <Td>
                <Text variant="mono" className={styles.address}>
                  {address}
                </Text>
              </Td>
              <Td>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleRemoveAddress(address)}
                  disabled={isLoading || address === connectedAddress}
                >
                  <FaTrash />
                </Button>
              </Td>
            </Tr>
          ))}
          <Tr>
            <Td className={styles.newAddressColumn}>
              <Field
                label="NEW ADDRESS"
                error={!addressIsValid && newAddress !== ""}
                errorMessage="This is not a valid address"
              >
                <Input variant="secondary" value={newAddress} onChange={setNewAddress} textVariant="mono" />
              </Field>
            </Td>
            <Td>
              <Button
                size="small"
                variant="secondary"
                onClick={handleAddNewAddress}
                disabled={!addressIsValid || isLoading}
              >
                <FaPlusSquare />
              </Button>
            </Td>
          </Tr>
        </TBody>
      </Table>
      {isError && <ErrorModal reason={error.fieldErrors ?? error.message} onClose={handleErrorModalClose} />}
    </Box>
  )
}

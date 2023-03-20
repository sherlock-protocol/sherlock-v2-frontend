import { useCallback, useState } from "react"
import { FaCopy } from "react-icons/fa"
import { Button } from "../Button"
import { Row } from "../Layout"
import { Text } from "../Text"

import styles from "./CopyAddress.module.scss"

type Props = {
  address: string
}

export const CopyAddress: React.FC<Props> = ({ address }) => {
  const [displayCopiedMessage, setDisplayCopiedMessage] = useState(false)

  const handleRecipientAddressCopy = useCallback(async () => {
    await navigator.clipboard.writeText(address)
    setDisplayCopiedMessage(true)

    const timer = setTimeout(() => {
      setDisplayCopiedMessage(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [address])

  return (
    <div className={styles.container}>
      <Row
        spacing="m"
        className={styles.mainAddress}
        alignment={["space-between", "center"]}
        onClick={handleRecipientAddressCopy}
        grow={1}
      >
        <Text size="large">{address}</Text>
        <Button variant="secondary" size="small" onClick={handleRecipientAddressCopy}>
          <FaCopy />
        </Button>
      </Row>
      {displayCopiedMessage && <div className={styles.copied}>Copied!</div>}
    </div>
  )
}

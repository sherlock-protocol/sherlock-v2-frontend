import cx from "classnames"
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
    <Row
      spacing="m"
      className={cx({
        [styles.mainAddress]: true,
        [styles.copied]: displayCopiedMessage,
      })}
      alignment={[displayCopiedMessage ? "center" : "space-between", "center"]}
      onClick={handleRecipientAddressCopy}
    >
      <Text size="large">{displayCopiedMessage ? "Copied!" : address}</Text>
      {!displayCopiedMessage && (
        <Button variant="secondary" size="small" onClick={handleRecipientAddressCopy}>
          <FaCopy />
        </Button>
      )}
    </Row>
  )
}

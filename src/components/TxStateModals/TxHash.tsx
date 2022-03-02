import React from "react"
import { shortenAddress } from "../../utils/format"
import styles from "./TxStateModals.module.scss"
import { FiExternalLink } from "react-icons/fi"
import { getTxUrl } from "../../utils/explorer"
import { Text } from "../Text"

interface Props {
  /**
   * Transaction hash
   */
  hash: string
}

const TxHash: React.FC<Props> = ({ hash }) => {
  return (
    <Text size="small" className={styles.caption}>
      Transaction hash:{" "}
      <a href={getTxUrl(hash)} target="_blank" rel="noreferrer" className={styles.link}>
        {shortenAddress(hash)} <FiExternalLink />
      </a>
    </Text>
  )
}

export default React.memo(TxHash)

import React, { useCallback, useState } from "react"
import { Column } from "../Layout"
import { Text } from "../Text"

import styles from "./FileDrop.module.scss"

type Props = {
  onFileChange: (file: File, hash: string) => void
}

const shortenFileName = (fileName: string) => {
  if (fileName.length <= 16) return fileName

  const extensionStart = fileName.lastIndexOf(".") > 0 ? fileName.lastIndexOf(".") : fileName.length
  const extension = fileName.substring(extensionStart)

  return `${fileName.substring(0, 8)}...${fileName.substring(extensionStart - 8, extensionStart)}${extension}`
}

export const FileDrop: React.FC<Props> = ({ onFileChange }) => {
  const [fileName, setFileName] = useState<string>()

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      if (!e.target.files?.length) return

      const file = e.target.files[0]

      const reader = new FileReader()

      reader.onload = async (res) => {
        const data: ArrayBuffer = res.target?.result as ArrayBuffer
        const hashBuffer = await crypto.subtle.digest("SHA-256", data) // SHA-256 digest of file contents
        const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("") // convert bytes to hex string
        // const base64Content = Buffer.from(data).toString("base64")

        setFileName(file.name)
        onFileChange(file, hashHex)
      }
      reader.onerror = (error) => {
        console.log(error)
      }

      reader.readAsArrayBuffer(file)
    },
    [onFileChange]
  )

  return (
    <Column className={styles.fileDrop} alignment={["center", "center"]}>
      {fileName ? <Text>File: {shortenFileName(fileName)}</Text> : <Text>Click to upload file ...</Text>}
      <input type="file" accept=".pdf" onChange={handleFileChange} placeholder="" />
    </Column>
  )
}

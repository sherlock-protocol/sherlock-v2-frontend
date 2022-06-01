import axios from "axios"

type SignedUploadUrlResponseData = {
  url: string
  fields: Record<string, string>
}

export const uploadFile = async (file: File, path: string) => {
  const signedURLResponse = await axios.post<SignedUploadUrlResponseData>(`/api/signed_upload_url?file=${path}`)

  const { url, fields } = signedURLResponse.data

  const formData = new FormData()

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value)
  })

  await axios.post(url, formData)

  // This is the url where the file was uploaded
  const fileURL = url.concat(fields.key)
  return fileURL
}

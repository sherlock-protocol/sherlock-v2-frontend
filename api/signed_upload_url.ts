import { VercelRequest, VercelResponse } from "@vercel/node"
import aws from "aws-sdk"

async function generateSignedUploadURL(req: VercelRequest, res: VercelResponse): Promise<void> {
  aws.config.update({
    accessKeyId: process.env.DIGITAL_OCEAN_KEY,
    secretAccessKey: process.env.DIGITAL_OCEAN_SECRET,
    region: process.env.DIGITAL_OCEAN_REGION,
    signatureVersion: "v4",
    s3BucketEndpoint: true,
  })

  const s3 = new aws.S3({
    endpoint: process.env.DIGITAL_OCEAN_ENDPOINT,
    region: process.env.DIGITAL_OCEAN_REGION,
  })

  const post = s3.createPresignedPost({
    Bucket: process.env.DIGITAL_OCEAN_BUCKET_NAME,
    Fields: {
      key: req.query.file,
      ACL: "public-read", // File needs to be public to read so UMA holders can download it
    },
    Expires: 30, // seconds
  })

  res.status(200).json(post)
}

export default generateSignedUploadURL

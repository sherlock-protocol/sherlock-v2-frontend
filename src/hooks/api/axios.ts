import axios from "axios"
import config from "../../config"

const instance = axios.create({
  baseURL: config.indexerBaseUrl,
  timeout: 30000,
})

export default instance

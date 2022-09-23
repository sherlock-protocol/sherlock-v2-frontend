import axios from "axios"
import config from "../../config"

const instance = axios.create({
  baseURL: config.indexerBaseUrl,
  timeout: 30000,
})

export const contests = axios.create({
  baseURL: config.contestsApiBaseUrl,
  timeout: 30000,
  withCredentials: true,
})

export default instance

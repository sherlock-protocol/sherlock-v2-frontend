import { config as mainnetConfig } from "./mainnet"
import { config as envConfig } from "./env"
import { Config } from "./ConfigType"

const networkId = parseInt(process.env.REACT_APP_NETWORK_ID as string)
const config: Config = networkId === 1 ? mainnetConfig : envConfig

export default config

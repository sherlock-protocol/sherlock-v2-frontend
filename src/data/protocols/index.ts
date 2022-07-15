import euler from "./euler"
import squeeth_by_opyn from "./squeeth_by_opyn"
import tempus_finance from "./tempus_finance"
import liquifi from "./liquifi"
import lyra from "./lyra"

export type CoveredProtocolMeta = {
  id: string
  tag: string
  name?: string
  defi_llama_slug?: string
  hardcoded_tvl?: string
  networks?: string
  website?: string
  logo?: string
  description?: string
  agreement?: string
  agreement_hash?: string
  agent?: string
  pay_year?: string
  pay_contracts?: string
  premium?: string
}

type CoveredProtocolsMetas = {
  [key: string]: CoveredProtocolMeta
}

const coveredProtocolMetas: CoveredProtocolsMetas = {
  [euler.id]: euler,
  [squeeth_by_opyn.id]: squeeth_by_opyn,
  [tempus_finance.id]: tempus_finance,
  [liquifi.id]: liquifi,
  [lyra.id]: lyra,
}

export default coveredProtocolMetas

import euler from "./euler"
import squeeth_by_opyn from "./squeeth_by_opyn"
import tempus_finance from "./tempus_finance"

export type CoveredProtocolMeta = {
  id: string
  name?: string
  website?: string
  logo?: string
  description?: string
  agreement?: string
}

type CoveredProtocolsMetas = {
  [key: string]: CoveredProtocolMeta
}

const coveredProtocolMetas: CoveredProtocolsMetas = {
  [euler.id]: euler,
  [squeeth_by_opyn.id]: squeeth_by_opyn,
  [tempus_finance.id]: tempus_finance,
}

export default coveredProtocolMetas

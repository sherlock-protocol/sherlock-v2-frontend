import euler from "./euler"
import squeeth_by_opyn from "./squeeth_by_opyn"
import tempus_finance from "./tempus_finance"
import fran__1 from "./fran__1"
import fran__2 from "./fran__2"
import fran__3 from "./fran__3"
import fran__4 from "./fran__4"

export type CoveredProtocolMeta = {
  id: string
  tag: string
  name?: string
  website?: string
  logo?: string
  description?: string
  agreement?: string
  agreement_hash?: string
  agent?: string
  pay_year?: string
  pay_contracts?: string
}

type CoveredProtocolsMetas = {
  [key: string]: CoveredProtocolMeta
}

const coveredProtocolMetas: CoveredProtocolsMetas = {
  [euler.id]: euler,
  [squeeth_by_opyn.id]: squeeth_by_opyn,
  [tempus_finance.id]: tempus_finance,
  [fran__1.id]: fran__1,
  [fran__2.id]: fran__2,
  [fran__3.id]: fran__3,
  [fran__4.id]: fran__4,
}

export default coveredProtocolMetas

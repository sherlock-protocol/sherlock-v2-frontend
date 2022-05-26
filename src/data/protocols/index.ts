import euler from "./euler"
import squeeth_by_opyn from "./squeeth_by_opyn"
import tempus_finance from "./tempus_finance"
import fran from "./fran"
import fran_2 from "./fran_2"
import fran_3 from "./fran_3"
import fran_4 from "./fran_4"

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
  [fran.id]: fran,
  [fran_2.id]: fran_2,
  [fran_3.id]: fran_3,
  [fran_4.id]: fran_4,
}

export default coveredProtocolMetas

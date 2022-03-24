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

const coveredProtocolMetas: CoveredProtocolsMetas = {}

export default coveredProtocolMetas

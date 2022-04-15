import { CoveredProtocolMeta } from "./index"

const meta: CoveredProtocolMeta = {
  id: "0x99b8883ea932491b57118762f4b507ebcac598bee27b98f443c06d889237d9a4",
  tag: "opyn",
  name: "Squeeth by Opyn",
  website: "https://www.opyn.co/",
  logo: "",
  description:
    "Squeeth (squared ETH) is a Power Perpetual that tracks the price of ETH². This functions similar to a perpetual swap where you are targeting ETH² rather than ETH. Long Squeeth gives traders a leveraged position with unlimited ETH² upside, protected downside, and no liquidations. Squeeth buyers pay a funding rate for this position. In contrast, short Squeeth is a short ETH² position, collateralized with ETH. Traders earn a funding rate for taking on this position, paid by long Squeeth holders.",
  agreement: "https://v1.sherlock.xyz/static/pdf/PUBLIC_Opyn_Statement_of_Coverage.pdf",
  agreement_hash: "0x818980ecff06fdc814bc138a2cade7b8895c7265641c4d2f61150eeefd7926e6",
  agent: "0x609FFF64429e2A275a879e5C50e415cec842c629",
  pay_year: "$150,000.00",
  pay_contracts: "4756",
}

export default meta

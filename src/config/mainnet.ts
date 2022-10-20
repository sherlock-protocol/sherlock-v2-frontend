import { BigNumber } from "ethers"
import { Config } from "./ConfigType"

export const config: Config = {
  networkId: 1,
  sherBuyEntryDeadline: 1647100800,
  alchemyApiUrl: "wss://eth-mainnet.alchemyapi.io/v2/H7GQZq65vKCHEh5cnz_luQmYM8HWWcr-",
  indexerBaseUrl: "https://mainnet.indexer.sherlock.xyz/",
  contestsApiBaseUrl: "https://mainnet.contest.sherlock.xyz/",
  sherlockAddress: "0x0865a889183039689034dA55c1Fd12aF5083eabF",
  sherlockProtocolManagerAddress: "0x3d0b8A0A10835Ab9b0f0BeB54C5400B8aAcaa1D3",
  sherlockClaimManagerAddress: "0xFeEDD254ae4B7c44A0472Bb836b813Ce4625Eb84",
  sherAddress: "0x46D2A90153cd8F09464CA3a5605B6BBeC9C2fF01",
  sherBuyAddress: "0xf8583f22C2f6f8cd27f62879A0fB4319bce262a6",
  sherClaimAddress: "0x7289C61C75dCdB8Fe4DF0b937c08c9c40902BDd3",
  sherDistributionManagerAddress: "0x50b0845db1fb4c1b3a3786dc288b330c269e3993",
  usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  countdownStartTimestamp: 1649260800,
  countdownEndTimestamp: 1649347200,
  incentivesAPYBytesIdentifier: "0x47a46b3628edc31155b950156914c27d25890563476422202887ed4298fc3c98",
  stakingHardcap: BigNumber.from("25000000000000"),
  nexusMutualStartTimestamp: 1664582400,
}

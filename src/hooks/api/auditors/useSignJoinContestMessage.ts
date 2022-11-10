import { useSignTypedData } from "wagmi"

/**
 * EIP-712 message signature for auditor/team joining a contest
 */

export const useSignJoinContestMessage = (contestId: number) => {
  const domain = {
    name: "Sherlock Contest",
    version: "1",
  }

  const types = {
    JoinContest: [
      { name: "action", type: "string" },
      { name: "contest_id", type: "uint256" },
    ],
  }

  const value = {
    action: "join",
    contest_id: contestId,
  }

  return useSignTypedData({ domain, types, value })
}

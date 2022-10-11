import { useSignTypedData } from "wagmi"

/**
 * EIP-712 message signature for Auditor SignUp
 */
const domain = {
  name: "Sherlock Contest",
  version: "1",
}

const types = {
  Signup: [{ name: "action", type: "string" }],
}

const value = {
  action: "signup",
}

export const useSignSignUpMessage = () => useSignTypedData({ domain, types, value })

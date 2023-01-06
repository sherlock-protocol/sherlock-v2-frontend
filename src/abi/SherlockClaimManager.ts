const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_umaho",
        type: "address",
      },
      {
        internalType: "address",
        name: "_spcc",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ClaimActive",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidArgument",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidConditions",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSender",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidState",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroArgument",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract ISherlockClaimManagerCallbackReceiver",
        name: "callback",
        type: "address",
      },
    ],
    name: "CallbackAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract ISherlockClaimManagerCallbackReceiver",
        name: "callback",
        type: "address",
      },
    ],
    name: "CallbackRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "claimID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "protocol",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "previousCoverageUsed",
        type: "bool",
      },
    ],
    name: "ClaimCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "claimID",
        type: "uint256",
      },
    ],
    name: "ClaimHalted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "claimID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ClaimPayout",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "claimID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum ISherlockClaimManager.State",
        name: "previousState",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum ISherlockClaimManager.State",
        name: "currentState",
        type: "uint8",
      },
    ],
    name: "ClaimStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract ISherlock",
        name: "sherlock",
        type: "address",
      },
    ],
    name: "SherlockCoreSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "UMAHORenounced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "ESCALATE_TIME",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_CALLBACKS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SPCC_TIME",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UMA",
    outputs: [
      {
        internalType: "contract SkinnyOptimisticOracleInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UMAHO_TIME",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UMA_IDENTIFIER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISherlockClaimManagerCallbackReceiver",
        name: "_callback",
        type: "address",
      },
    ],
    name: "addCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimID",
        type: "uint256",
      },
    ],
    name: "claim",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "created",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updated",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "initiator",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "protocol",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "timestamp",
            type: "uint32",
          },
          {
            internalType: "enum ISherlockClaimManager.State",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "bytes",
            name: "ancillaryData",
            type: "bytes",
          },
        ],
        internalType: "struct ISherlockClaimManager.Claim",
        name: "claim_",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "claimCallbacks",
    outputs: [
      {
        internalType: "contract ISherlockClaimManagerCallbackReceiver",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_protocol",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_claimID",
        type: "uint256",
      },
    ],
    name: "cleanUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "escalate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimID",
        type: "uint256",
      },
    ],
    name: "executeHalt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimID",
        type: "uint256",
      },
    ],
    name: "payoutClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "identifier",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "timestamp",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "ancillaryData",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "address",
            name: "disputer",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "currency",
            type: "address",
          },
          {
            internalType: "bool",
            name: "settled",
            type: "bool",
          },
          {
            internalType: "int256",
            name: "proposedPrice",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "resolvedPrice",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "expirationTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "finalFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bond",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "customLiveness",
            type: "uint256",
          },
        ],
        internalType: "struct SkinnyOptimisticOracleInterface.Request",
        name: "request",
        type: "tuple",
      },
    ],
    name: "priceDisputed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "identifier",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "timestamp",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "ancillaryData",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "address",
            name: "disputer",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "currency",
            type: "address",
          },
          {
            internalType: "bool",
            name: "settled",
            type: "bool",
          },
          {
            internalType: "int256",
            name: "proposedPrice",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "resolvedPrice",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "expirationTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "finalFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bond",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "customLiveness",
            type: "uint256",
          },
        ],
        internalType: "struct SkinnyOptimisticOracleInterface.Request",
        name: "request",
        type: "tuple",
      },
    ],
    name: "priceProposed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "identifier",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "timestamp",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "ancillaryData",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "address",
            name: "disputer",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "currency",
            type: "address",
          },
          {
            internalType: "bool",
            name: "settled",
            type: "bool",
          },
          {
            internalType: "int256",
            name: "proposedPrice",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "resolvedPrice",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "expirationTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "finalFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bond",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "customLiveness",
            type: "uint256",
          },
        ],
        internalType: "struct SkinnyOptimisticOracleInterface.Request",
        name: "request",
        type: "tuple",
      },
    ],
    name: "priceSettled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "protocolClaimActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISherlockClaimManagerCallbackReceiver",
        name: "_callback",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "removeCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceUmaHaltOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISherlock",
        name: "_sherlock",
        type: "address",
      },
    ],
    name: "setSherlockCoreAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sherlockProtocolClaimsCommittee",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimID",
        type: "uint256",
      },
    ],
    name: "spccApprove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_claimID",
        type: "uint256",
      },
    ],
    name: "spccRefuse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_protocol",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_timestamp",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "ancillaryData",
        type: "bytes",
      },
    ],
    name: "startClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "umaHaltOperator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export default abi

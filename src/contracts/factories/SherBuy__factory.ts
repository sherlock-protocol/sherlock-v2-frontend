/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides, BigNumberish } from "ethers"
import { Provider, TransactionRequest } from "@ethersproject/providers"
import type { SherBuy, SherBuyInterface } from "../SherBuy"

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_sher",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_usdc",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_stakeRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_buyRate",
        type: "uint256",
      },
      {
        internalType: "contract ISherlock",
        name: "_sherlockPosition",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "contract ISherClaim",
        name: "_sherClaim",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidAmount",
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
    name: "SoldOut",
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
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "staked",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paid",
        type: "uint256",
      },
    ],
    name: "Purchase",
    type: "event",
  },
  {
    inputs: [],
    name: "PERIOD",
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
    name: "active",
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
    inputs: [],
    name: "buyRate",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_sherAmountWant",
        type: "uint256",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "receiver",
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
    name: "sher",
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
    name: "sherClaim",
    outputs: [
      {
        internalType: "contract ISherClaim",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sherlockPosition",
    outputs: [
      {
        internalType: "contract ISherlock",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeRate",
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
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "_tokens",
        type: "address[]",
      },
    ],
    name: "sweepTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_sherAmountWant",
        type: "uint256",
      },
    ],
    name: "viewCapitalRequirements",
    outputs: [
      {
        internalType: "uint256",
        name: "sherAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

const _bytecode =
  "0x6101606040523480156200001257600080fd5b50604051620016bf380380620016bf8339810160408190526200003591620002ec565b6001600160a01b0387166200005d5760405163b7852ebb60e01b815260040160405180910390fd5b6001600160a01b038616620000855760405163b7852ebb60e01b815260040160405180910390fd5b84620000a45760405163b7852ebb60e01b815260040160405180910390fd5b620000b26127108662000380565b15620000d15760405163baf3f0f760e01b815260040160405180910390fd5b83620000f05760405163b7852ebb60e01b815260040160405180910390fd5b620000fe6127108562000380565b156200011d5760405163baf3f0f760e01b815260040160405180910390fd5b6001600160a01b038316620001455760405163b7852ebb60e01b815260040160405180910390fd5b6001600160a01b0382166200016d5760405163b7852ebb60e01b815260040160405180910390fd5b6001600160a01b038116620001955760405163b7852ebb60e01b815260040160405180910390fd5b604051638af92c9360e01b815262eff10060048201526001600160a01b03841690638af92c9390602401602060405180830381865afa158015620001dd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002039190620003a3565b620002215760405163baf3f0f760e01b815260040160405180910390fd5b6001600160a01b0387811660805286811660a081905260c087905260e0869052848216610100819052848316610120529183166101405260405163095ea7b360e01b8152600481019290925260001960248301529063095ea7b3906044016020604051808303816000875af11580156200029f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002c59190620003a3565b5050505050505050620003ce565b6001600160a01b0381168114620002e957600080fd5b50565b600080600080600080600060e0888a0312156200030857600080fd5b87516200031581620002d3565b60208901519097506200032881620002d3565b80965050604088015194506060880151935060808801516200034a81620002d3565b60a08901519093506200035d81620002d3565b60c08901519092506200037081620002d3565b8091505092959891949750929550565b6000826200039e57634e487b7160e01b600052601260045260246000fd5b500690565b600060208284031215620003b657600080fd5b81518015158114620003c757600080fd5b9392505050565b60805160a05160c05160e0516101005161012051610140516112436200047c600039600081816101f00152818161029e015281816108d001526109a20152600081816102170152818161058c01526107ad015260008181610278015261081001526000818161023e015261053c01526000818161017501526104fd01526000818160fb01528181610748015261078a0152600081816101bf015281816103dd01526108ff01526112436000f3fe608060405234801561001057600080fd5b50600436106100d45760003560e01c8063b4d1d79511610081578063fc37987b1161005b578063fc37987b14610239578063fe0d94c114610260578063fee479d31461027357600080fd5b8063b4d1d795146101e1578063d933b3c0146101eb578063f7260d3e1461021257600080fd5b806381160fe3116100b257806381160fe314610170578063909b19d9146101a5578063937840b0146101ba57600080fd5b806302fb0c5e146100d95780633e413bee146100f657806342a14b8114610142575b600080fd5b6100e161029a565b60405190151581526020015b60405180910390f35b61011d7f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100ed565b610155610150366004610e96565b610332565b604080519384526020840192909252908201526060016100ed565b6101977f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020016100ed565b6101b86101b3366004610f07565b610574565b005b61011d7f000000000000000000000000000000000000000000000000000000000000000081565b61019762eff10081565b61011d7f000000000000000000000000000000000000000000000000000000000000000081565b61011d7f000000000000000000000000000000000000000000000000000000000000000081565b6101977f000000000000000000000000000000000000000000000000000000000000000081565b6101b861026e366004610e96565b610719565b61011d7f000000000000000000000000000000000000000000000000000000000000000081565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166391e0a8aa6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610307573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061032b9190610fea565b4210905090565b600080600061033f61029a565b610375576040517fbaf3f0f700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b836103ac576040517fb7852ebb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16906370a0823190602401602060405180830381865afa158015610439573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061045d9190610fea565b905080610496576040517f52df9fe500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8481106104a357846104a5565b805b93506104b8662386f26fc1000085611032565b156104ef576040517f2c5211c600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b670de0b6b3a76400006105227f000000000000000000000000000000000000000000000000000000000000000086611075565b61052c91906110b2565b9250670de0b6b3a76400006105617f000000000000000000000000000000000000000000000000000000000000000086611075565b61056b91906110b2565b93959294505050565b3373ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016146105e3576040517fddb5de5e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6105eb61029a565b15610622576040517fbaf3f0f700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60005b8151811015610715576000828281518110610642576106426110c6565b60209081029190910101516040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015290915061070290339073ffffffffffffffffffffffffffffffffffffffff8416906370a0823190602401602060405180830381865afa1580156106c0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106e49190610fea565b73ffffffffffffffffffffffffffffffffffffffff84169190610a5c565b508061070d816110f5565b915050610625565b5050565b600080600061072784610332565b9194509250905061077073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016333085610b35565b6107d273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016337f000000000000000000000000000000000000000000000000000000000000000084610b35565b6040517f2f5cf62b0000000000000000000000000000000000000000000000000000000081526004810183905262eff10060248201523360448201527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1690632f5cf62b9060640160408051808303816000875af115801561086d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610891919061112e565b50506040517f095ea7b300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018590527f0000000000000000000000000000000000000000000000000000000000000000169063095ea7b3906044016020604051808303816000875af1158015610948573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061096c9190611152565b506040517ff5d82b6b000000000000000000000000000000000000000000000000000000008152336004820152602481018490527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff169063f5d82b6b90604401600060405180830381600087803b1580156109fb57600080fd5b505af1158015610a0f573d6000803e3d6000fd5b505060408051868152602081018690529081018490523392507f5bc97d73357ac0d035d4b9268a69240988a5776b8a4fcced3dbc223960123f40915060600160405180910390a250505050565b60405173ffffffffffffffffffffffffffffffffffffffff8316602482015260448101829052610b309084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152610b99565b505050565b60405173ffffffffffffffffffffffffffffffffffffffff80851660248301528316604482015260648101829052610b939085907f23b872dd0000000000000000000000000000000000000000000000000000000090608401610aae565b50505050565b6000610bfb826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16610caa9092919063ffffffff16565b805190915015610b305780806020019051810190610c199190611152565b610b30576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f7420737563636565640000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6060610cb98484600085610cc3565b90505b9392505050565b606082471015610d55576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610ca1565b843b610dbd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610ca1565b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051610de691906111a0565b60006040518083038185875af1925050503d8060008114610e23576040519150601f19603f3d011682016040523d82523d6000602084013e610e28565b606091505b5091509150610e38828286610e43565b979650505050505050565b60608315610e52575081610cbc565b825115610e625782518084602001fd5b816040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ca191906111bc565b600060208284031215610ea857600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b803573ffffffffffffffffffffffffffffffffffffffff81168114610f0257600080fd5b919050565b60006020808385031215610f1a57600080fd5b823567ffffffffffffffff80821115610f3257600080fd5b818501915085601f830112610f4657600080fd5b813581811115610f5857610f58610eaf565b8060051b6040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0603f83011681018181108582111715610f9b57610f9b610eaf565b604052918252848201925083810185019188831115610fb957600080fd5b938501935b82851015610fde57610fcf85610ede565b84529385019392850192610fbe565b98975050505050505050565b600060208284031215610ffc57600080fd5b5051919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60008261104157611041611003565b500690565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156110ad576110ad611046565b500290565b6000826110c1576110c1611003565b500490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561112757611127611046565b5060010190565b6000806040838503121561114157600080fd5b505080516020909101519092909150565b60006020828403121561116457600080fd5b81518015158114610cbc57600080fd5b60005b8381101561118f578181015183820152602001611177565b83811115610b935750506000910152565b600082516111b2818460208701611174565b9190910192915050565b60208152600082518060208401526111db816040850160208701611174565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fea2646970667358221220a16a8b65540f70cf0b5d3c5b20b1478f7dea97723c895215c7d646fecc8d8a1b64736f6c634300080a0033"

type SherBuyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (xs: SherBuyConstructorParams): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class SherBuy__factory extends ContractFactory {
  constructor(...args: SherBuyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
    this.contractName = "SherBuy"
  }

  deploy(
    _sher: string,
    _usdc: string,
    _stakeRate: BigNumberish,
    _buyRate: BigNumberish,
    _sherlockPosition: string,
    _receiver: string,
    _sherClaim: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SherBuy> {
    return super.deploy(
      _sher,
      _usdc,
      _stakeRate,
      _buyRate,
      _sherlockPosition,
      _receiver,
      _sherClaim,
      overrides || {}
    ) as Promise<SherBuy>
  }
  getDeployTransaction(
    _sher: string,
    _usdc: string,
    _stakeRate: BigNumberish,
    _buyRate: BigNumberish,
    _sherlockPosition: string,
    _receiver: string,
    _sherClaim: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _sher,
      _usdc,
      _stakeRate,
      _buyRate,
      _sherlockPosition,
      _receiver,
      _sherClaim,
      overrides || {}
    )
  }
  attach(address: string): SherBuy {
    return super.attach(address) as SherBuy
  }
  connect(signer: Signer): SherBuy__factory {
    return super.connect(signer) as SherBuy__factory
  }
  static readonly contractName: "SherBuy"
  public readonly contractName: "SherBuy"
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): SherBuyInterface {
    return new utils.Interface(_abi) as SherBuyInterface
  }
  static connect(address: string, signerOrProvider: Signer | Provider): SherBuy {
    return new Contract(address, _abi, signerOrProvider) as SherBuy
  }
}
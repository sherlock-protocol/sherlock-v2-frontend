/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers"
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi"
import { Listener, Provider } from "@ethersproject/providers"
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common"

export declare namespace ISherlockClaimManager {
  export type ClaimStruct = {
    created: BigNumberish
    updated: BigNumberish
    initiator: string
    protocol: BytesLike
    amount: BigNumberish
    receiver: string
    timestamp: BigNumberish
    state: BigNumberish
    ancillaryData: BytesLike
  }

  export type ClaimStructOutput = [BigNumber, BigNumber, string, string, BigNumber, string, number, number, string] & {
    created: BigNumber
    updated: BigNumber
    initiator: string
    protocol: string
    amount: BigNumber
    receiver: string
    timestamp: number
    state: number
    ancillaryData: string
  }
}

export declare namespace SkinnyOptimisticOracleInterface {
  export type RequestStruct = {
    proposer: string
    disputer: string
    currency: string
    settled: boolean
    proposedPrice: BigNumberish
    resolvedPrice: BigNumberish
    expirationTime: BigNumberish
    reward: BigNumberish
    finalFee: BigNumberish
    bond: BigNumberish
    customLiveness: BigNumberish
  }

  export type RequestStructOutput = [
    string,
    string,
    string,
    boolean,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    proposer: string
    disputer: string
    currency: string
    settled: boolean
    proposedPrice: BigNumber
    resolvedPrice: BigNumber
    expirationTime: BigNumber
    reward: BigNumber
    finalFee: BigNumber
    bond: BigNumber
    customLiveness: BigNumber
  }
}

export interface SherlockClaimManagerInterface extends utils.Interface {
  contractName: "SherlockClaimManager"
  functions: {
    "ESCALATE_TIME()": FunctionFragment
    "MAX_CALLBACKS()": FunctionFragment
    "SPCC_TIME()": FunctionFragment
    "TOKEN()": FunctionFragment
    "UMA()": FunctionFragment
    "UMAHO_TIME()": FunctionFragment
    "UMA_IDENTIFIER()": FunctionFragment
    "addCallback(address)": FunctionFragment
    "claim(uint256)": FunctionFragment
    "claimCallbacks(uint256)": FunctionFragment
    "cleanUp(bytes32,uint256)": FunctionFragment
    "escalate(uint256,uint256)": FunctionFragment
    "executeHalt(uint256)": FunctionFragment
    "owner()": FunctionFragment
    "pause()": FunctionFragment
    "paused()": FunctionFragment
    "payoutClaim(uint256)": FunctionFragment
    "priceDisputed(bytes32,uint32,bytes,(address,address,address,bool,int256,int256,uint256,uint256,uint256,uint256,uint256))": FunctionFragment
    "priceProposed(bytes32,uint32,bytes,(address,address,address,bool,int256,int256,uint256,uint256,uint256,uint256,uint256))": FunctionFragment
    "priceSettled(bytes32,uint32,bytes,(address,address,address,bool,int256,int256,uint256,uint256,uint256,uint256,uint256))": FunctionFragment
    "protocolClaimActive(bytes32)": FunctionFragment
    "removeCallback(address,uint256)": FunctionFragment
    "renounceOwnership()": FunctionFragment
    "renounceUmaHaltOperator()": FunctionFragment
    "setSherlockCoreAddress(address)": FunctionFragment
    "sherlockProtocolClaimsCommittee()": FunctionFragment
    "spccApprove(uint256)": FunctionFragment
    "spccRefuse(uint256)": FunctionFragment
    "startClaim(bytes32,uint256,address,uint32,bytes)": FunctionFragment
    "transferOwnership(address)": FunctionFragment
    "umaHaltOperator()": FunctionFragment
    "unpause()": FunctionFragment
  }

  encodeFunctionData(functionFragment: "ESCALATE_TIME", values?: undefined): string
  encodeFunctionData(functionFragment: "MAX_CALLBACKS", values?: undefined): string
  encodeFunctionData(functionFragment: "SPCC_TIME", values?: undefined): string
  encodeFunctionData(functionFragment: "TOKEN", values?: undefined): string
  encodeFunctionData(functionFragment: "UMA", values?: undefined): string
  encodeFunctionData(functionFragment: "UMAHO_TIME", values?: undefined): string
  encodeFunctionData(functionFragment: "UMA_IDENTIFIER", values?: undefined): string
  encodeFunctionData(functionFragment: "addCallback", values: [string]): string
  encodeFunctionData(functionFragment: "claim", values: [BigNumberish]): string
  encodeFunctionData(functionFragment: "claimCallbacks", values: [BigNumberish]): string
  encodeFunctionData(functionFragment: "cleanUp", values: [BytesLike, BigNumberish]): string
  encodeFunctionData(functionFragment: "escalate", values: [BigNumberish, BigNumberish]): string
  encodeFunctionData(functionFragment: "executeHalt", values: [BigNumberish]): string
  encodeFunctionData(functionFragment: "owner", values?: undefined): string
  encodeFunctionData(functionFragment: "pause", values?: undefined): string
  encodeFunctionData(functionFragment: "paused", values?: undefined): string
  encodeFunctionData(functionFragment: "payoutClaim", values: [BigNumberish]): string
  encodeFunctionData(
    functionFragment: "priceDisputed",
    values: [BytesLike, BigNumberish, BytesLike, SkinnyOptimisticOracleInterface.RequestStruct]
  ): string
  encodeFunctionData(
    functionFragment: "priceProposed",
    values: [BytesLike, BigNumberish, BytesLike, SkinnyOptimisticOracleInterface.RequestStruct]
  ): string
  encodeFunctionData(
    functionFragment: "priceSettled",
    values: [BytesLike, BigNumberish, BytesLike, SkinnyOptimisticOracleInterface.RequestStruct]
  ): string
  encodeFunctionData(functionFragment: "protocolClaimActive", values: [BytesLike]): string
  encodeFunctionData(functionFragment: "removeCallback", values: [string, BigNumberish]): string
  encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string
  encodeFunctionData(functionFragment: "renounceUmaHaltOperator", values?: undefined): string
  encodeFunctionData(functionFragment: "setSherlockCoreAddress", values: [string]): string
  encodeFunctionData(functionFragment: "sherlockProtocolClaimsCommittee", values?: undefined): string
  encodeFunctionData(functionFragment: "spccApprove", values: [BigNumberish]): string
  encodeFunctionData(functionFragment: "spccRefuse", values: [BigNumberish]): string
  encodeFunctionData(
    functionFragment: "startClaim",
    values: [BytesLike, BigNumberish, string, BigNumberish, BytesLike]
  ): string
  encodeFunctionData(functionFragment: "transferOwnership", values: [string]): string
  encodeFunctionData(functionFragment: "umaHaltOperator", values?: undefined): string
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string

  decodeFunctionResult(functionFragment: "ESCALATE_TIME", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "MAX_CALLBACKS", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "SPCC_TIME", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "TOKEN", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "UMA", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "UMAHO_TIME", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "UMA_IDENTIFIER", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "addCallback", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "claimCallbacks", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "cleanUp", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "escalate", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "executeHalt", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "payoutClaim", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "priceDisputed", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "priceProposed", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "priceSettled", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "protocolClaimActive", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "removeCallback", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "renounceUmaHaltOperator", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "setSherlockCoreAddress", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "sherlockProtocolClaimsCommittee", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "spccApprove", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "spccRefuse", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "startClaim", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "umaHaltOperator", data: BytesLike): Result
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result

  events: {
    "CallbackAdded(address)": EventFragment
    "CallbackRemoved(address)": EventFragment
    "ClaimCreated(uint256,bytes32,uint256,address,bool)": EventFragment
    "ClaimHalted(uint256)": EventFragment
    "ClaimPayout(uint256,address,uint256)": EventFragment
    "ClaimStatusChanged(uint256,uint8,uint8)": EventFragment
    "OwnershipTransferred(address,address)": EventFragment
    "Paused(address)": EventFragment
    "SherlockCoreSet(address)": EventFragment
    "UMAHORenounced()": EventFragment
    "Unpaused(address)": EventFragment
  }

  getEvent(nameOrSignatureOrTopic: "CallbackAdded"): EventFragment
  getEvent(nameOrSignatureOrTopic: "CallbackRemoved"): EventFragment
  getEvent(nameOrSignatureOrTopic: "ClaimCreated"): EventFragment
  getEvent(nameOrSignatureOrTopic: "ClaimHalted"): EventFragment
  getEvent(nameOrSignatureOrTopic: "ClaimPayout"): EventFragment
  getEvent(nameOrSignatureOrTopic: "ClaimStatusChanged"): EventFragment
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment
  getEvent(nameOrSignatureOrTopic: "SherlockCoreSet"): EventFragment
  getEvent(nameOrSignatureOrTopic: "UMAHORenounced"): EventFragment
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment
}

export type CallbackAddedEvent = TypedEvent<[string], { callback: string }>

export type CallbackAddedEventFilter = TypedEventFilter<CallbackAddedEvent>

export type CallbackRemovedEvent = TypedEvent<[string], { callback: string }>

export type CallbackRemovedEventFilter = TypedEventFilter<CallbackRemovedEvent>

export type ClaimCreatedEvent = TypedEvent<
  [BigNumber, string, BigNumber, string, boolean],
  {
    claimID: BigNumber
    protocol: string
    amount: BigNumber
    receiver: string
    previousCoverageUsed: boolean
  }
>

export type ClaimCreatedEventFilter = TypedEventFilter<ClaimCreatedEvent>

export type ClaimHaltedEvent = TypedEvent<[BigNumber], { claimID: BigNumber }>

export type ClaimHaltedEventFilter = TypedEventFilter<ClaimHaltedEvent>

export type ClaimPayoutEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  { claimID: BigNumber; receiver: string; amount: BigNumber }
>

export type ClaimPayoutEventFilter = TypedEventFilter<ClaimPayoutEvent>

export type ClaimStatusChangedEvent = TypedEvent<
  [BigNumber, number, number],
  { claimID: BigNumber; previousState: number; currentState: number }
>

export type ClaimStatusChangedEventFilter = TypedEventFilter<ClaimStatusChangedEvent>

export type OwnershipTransferredEvent = TypedEvent<[string, string], { previousOwner: string; newOwner: string }>

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>

export type PausedEvent = TypedEvent<[string], { account: string }>

export type PausedEventFilter = TypedEventFilter<PausedEvent>

export type SherlockCoreSetEvent = TypedEvent<[string], { sherlock: string }>

export type SherlockCoreSetEventFilter = TypedEventFilter<SherlockCoreSetEvent>

export type UMAHORenouncedEvent = TypedEvent<[], {}>

export type UMAHORenouncedEventFilter = TypedEventFilter<UMAHORenouncedEvent>

export type UnpausedEvent = TypedEvent<[string], { account: string }>

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>

export interface SherlockClaimManager extends BaseContract {
  contractName: "SherlockClaimManager"
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: SherlockClaimManagerInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    ESCALATE_TIME(overrides?: CallOverrides): Promise<[BigNumber]>

    MAX_CALLBACKS(overrides?: CallOverrides): Promise<[BigNumber]>

    SPCC_TIME(overrides?: CallOverrides): Promise<[BigNumber]>

    TOKEN(overrides?: CallOverrides): Promise<[string]>

    UMA(overrides?: CallOverrides): Promise<[string]>

    UMAHO_TIME(overrides?: CallOverrides): Promise<[BigNumber]>

    UMA_IDENTIFIER(overrides?: CallOverrides): Promise<[string]>

    addCallback(
      _callback: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    claim(
      _claimID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [ISherlockClaimManager.ClaimStructOutput] & {
        claim_: ISherlockClaimManager.ClaimStructOutput
      }
    >

    claimCallbacks(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>

    cleanUp(
      _protocol: BytesLike,
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    escalate(
      _claimID: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    executeHalt(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    owner(overrides?: CallOverrides): Promise<[string]>

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    paused(overrides?: CallOverrides): Promise<[boolean]>

    payoutClaim(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    priceDisputed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    priceProposed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    priceSettled(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    protocolClaimActive(arg0: BytesLike, overrides?: CallOverrides): Promise<[boolean]>

    removeCallback(
      _callback: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    renounceUmaHaltOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    setSherlockCoreAddress(
      _sherlock: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    sherlockProtocolClaimsCommittee(overrides?: CallOverrides): Promise<[string]>

    spccApprove(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    spccRefuse(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    startClaim(
      _protocol: BytesLike,
      _amount: BigNumberish,
      _receiver: string,
      _timestamp: BigNumberish,
      ancillaryData: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    umaHaltOperator(overrides?: CallOverrides): Promise<[string]>

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>
  }

  ESCALATE_TIME(overrides?: CallOverrides): Promise<BigNumber>

  MAX_CALLBACKS(overrides?: CallOverrides): Promise<BigNumber>

  SPCC_TIME(overrides?: CallOverrides): Promise<BigNumber>

  TOKEN(overrides?: CallOverrides): Promise<string>

  UMA(overrides?: CallOverrides): Promise<string>

  UMAHO_TIME(overrides?: CallOverrides): Promise<BigNumber>

  UMA_IDENTIFIER(overrides?: CallOverrides): Promise<string>

  addCallback(
    _callback: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  claim(_claimID: BigNumberish, overrides?: CallOverrides): Promise<ISherlockClaimManager.ClaimStructOutput>

  claimCallbacks(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>

  cleanUp(
    _protocol: BytesLike,
    _claimID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  escalate(
    _claimID: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  executeHalt(
    _claimID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  owner(overrides?: CallOverrides): Promise<string>

  pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  paused(overrides?: CallOverrides): Promise<boolean>

  payoutClaim(
    _claimID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  priceDisputed(
    identifier: BytesLike,
    timestamp: BigNumberish,
    ancillaryData: BytesLike,
    request: SkinnyOptimisticOracleInterface.RequestStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  priceProposed(
    identifier: BytesLike,
    timestamp: BigNumberish,
    ancillaryData: BytesLike,
    request: SkinnyOptimisticOracleInterface.RequestStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  priceSettled(
    identifier: BytesLike,
    timestamp: BigNumberish,
    ancillaryData: BytesLike,
    request: SkinnyOptimisticOracleInterface.RequestStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  protocolClaimActive(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>

  removeCallback(
    _callback: string,
    _index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  renounceUmaHaltOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  setSherlockCoreAddress(
    _sherlock: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  sherlockProtocolClaimsCommittee(overrides?: CallOverrides): Promise<string>

  spccApprove(
    _claimID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  spccRefuse(
    _claimID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  startClaim(
    _protocol: BytesLike,
    _amount: BigNumberish,
    _receiver: string,
    _timestamp: BigNumberish,
    ancillaryData: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  umaHaltOperator(overrides?: CallOverrides): Promise<string>

  unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  callStatic: {
    ESCALATE_TIME(overrides?: CallOverrides): Promise<BigNumber>

    MAX_CALLBACKS(overrides?: CallOverrides): Promise<BigNumber>

    SPCC_TIME(overrides?: CallOverrides): Promise<BigNumber>

    TOKEN(overrides?: CallOverrides): Promise<string>

    UMA(overrides?: CallOverrides): Promise<string>

    UMAHO_TIME(overrides?: CallOverrides): Promise<BigNumber>

    UMA_IDENTIFIER(overrides?: CallOverrides): Promise<string>

    addCallback(_callback: string, overrides?: CallOverrides): Promise<void>

    claim(_claimID: BigNumberish, overrides?: CallOverrides): Promise<ISherlockClaimManager.ClaimStructOutput>

    claimCallbacks(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>

    cleanUp(_protocol: BytesLike, _claimID: BigNumberish, overrides?: CallOverrides): Promise<void>

    escalate(_claimID: BigNumberish, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>

    executeHalt(_claimID: BigNumberish, overrides?: CallOverrides): Promise<void>

    owner(overrides?: CallOverrides): Promise<string>

    pause(overrides?: CallOverrides): Promise<void>

    paused(overrides?: CallOverrides): Promise<boolean>

    payoutClaim(_claimID: BigNumberish, overrides?: CallOverrides): Promise<void>

    priceDisputed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: CallOverrides
    ): Promise<void>

    priceProposed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: CallOverrides
    ): Promise<void>

    priceSettled(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: CallOverrides
    ): Promise<void>

    protocolClaimActive(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>

    removeCallback(_callback: string, _index: BigNumberish, overrides?: CallOverrides): Promise<void>

    renounceOwnership(overrides?: CallOverrides): Promise<void>

    renounceUmaHaltOperator(overrides?: CallOverrides): Promise<void>

    setSherlockCoreAddress(_sherlock: string, overrides?: CallOverrides): Promise<void>

    sherlockProtocolClaimsCommittee(overrides?: CallOverrides): Promise<string>

    spccApprove(_claimID: BigNumberish, overrides?: CallOverrides): Promise<void>

    spccRefuse(_claimID: BigNumberish, overrides?: CallOverrides): Promise<void>

    startClaim(
      _protocol: BytesLike,
      _amount: BigNumberish,
      _receiver: string,
      _timestamp: BigNumberish,
      ancillaryData: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>

    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>

    umaHaltOperator(overrides?: CallOverrides): Promise<string>

    unpause(overrides?: CallOverrides): Promise<void>
  }

  filters: {
    "CallbackAdded(address)"(callback?: null): CallbackAddedEventFilter
    CallbackAdded(callback?: null): CallbackAddedEventFilter

    "CallbackRemoved(address)"(callback?: null): CallbackRemovedEventFilter
    CallbackRemoved(callback?: null): CallbackRemovedEventFilter

    "ClaimCreated(uint256,bytes32,uint256,address,bool)"(
      claimID?: null,
      protocol?: BytesLike | null,
      amount?: null,
      receiver?: null,
      previousCoverageUsed?: null
    ): ClaimCreatedEventFilter
    ClaimCreated(
      claimID?: null,
      protocol?: BytesLike | null,
      amount?: null,
      receiver?: null,
      previousCoverageUsed?: null
    ): ClaimCreatedEventFilter

    "ClaimHalted(uint256)"(claimID?: null): ClaimHaltedEventFilter
    ClaimHalted(claimID?: null): ClaimHaltedEventFilter

    "ClaimPayout(uint256,address,uint256)"(claimID?: null, receiver?: null, amount?: null): ClaimPayoutEventFilter
    ClaimPayout(claimID?: null, receiver?: null, amount?: null): ClaimPayoutEventFilter

    "ClaimStatusChanged(uint256,uint8,uint8)"(
      claimID?: BigNumberish | null,
      previousState?: null,
      currentState?: null
    ): ClaimStatusChangedEventFilter
    ClaimStatusChanged(
      claimID?: BigNumberish | null,
      previousState?: null,
      currentState?: null
    ): ClaimStatusChangedEventFilter

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter

    "Paused(address)"(account?: null): PausedEventFilter
    Paused(account?: null): PausedEventFilter

    "SherlockCoreSet(address)"(sherlock?: null): SherlockCoreSetEventFilter
    SherlockCoreSet(sherlock?: null): SherlockCoreSetEventFilter

    "UMAHORenounced()"(): UMAHORenouncedEventFilter
    UMAHORenounced(): UMAHORenouncedEventFilter

    "Unpaused(address)"(account?: null): UnpausedEventFilter
    Unpaused(account?: null): UnpausedEventFilter
  }

  estimateGas: {
    ESCALATE_TIME(overrides?: CallOverrides): Promise<BigNumber>

    MAX_CALLBACKS(overrides?: CallOverrides): Promise<BigNumber>

    SPCC_TIME(overrides?: CallOverrides): Promise<BigNumber>

    TOKEN(overrides?: CallOverrides): Promise<BigNumber>

    UMA(overrides?: CallOverrides): Promise<BigNumber>

    UMAHO_TIME(overrides?: CallOverrides): Promise<BigNumber>

    UMA_IDENTIFIER(overrides?: CallOverrides): Promise<BigNumber>

    addCallback(_callback: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    claim(_claimID: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>

    claimCallbacks(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>

    cleanUp(
      _protocol: BytesLike,
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    escalate(
      _claimID: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    executeHalt(_claimID: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    owner(overrides?: CallOverrides): Promise<BigNumber>

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    paused(overrides?: CallOverrides): Promise<BigNumber>

    payoutClaim(_claimID: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    priceDisputed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    priceProposed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    priceSettled(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    protocolClaimActive(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>

    removeCallback(
      _callback: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    renounceUmaHaltOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    setSherlockCoreAddress(
      _sherlock: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    sherlockProtocolClaimsCommittee(overrides?: CallOverrides): Promise<BigNumber>

    spccApprove(_claimID: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    spccRefuse(_claimID: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    startClaim(
      _protocol: BytesLike,
      _amount: BigNumberish,
      _receiver: string,
      _timestamp: BigNumberish,
      ancillaryData: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    transferOwnership(newOwner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    umaHaltOperator(overrides?: CallOverrides): Promise<BigNumber>

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>
  }

  populateTransaction: {
    ESCALATE_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>

    MAX_CALLBACKS(overrides?: CallOverrides): Promise<PopulatedTransaction>

    SPCC_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>

    TOKEN(overrides?: CallOverrides): Promise<PopulatedTransaction>

    UMA(overrides?: CallOverrides): Promise<PopulatedTransaction>

    UMAHO_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>

    UMA_IDENTIFIER(overrides?: CallOverrides): Promise<PopulatedTransaction>

    addCallback(
      _callback: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    claim(_claimID: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>

    claimCallbacks(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>

    cleanUp(
      _protocol: BytesLike,
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    escalate(
      _claimID: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    executeHalt(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>

    payoutClaim(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    priceDisputed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    priceProposed(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    priceSettled(
      identifier: BytesLike,
      timestamp: BigNumberish,
      ancillaryData: BytesLike,
      request: SkinnyOptimisticOracleInterface.RequestStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    protocolClaimActive(arg0: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>

    removeCallback(
      _callback: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    renounceUmaHaltOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    setSherlockCoreAddress(
      _sherlock: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    sherlockProtocolClaimsCommittee(overrides?: CallOverrides): Promise<PopulatedTransaction>

    spccApprove(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    spccRefuse(
      _claimID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    startClaim(
      _protocol: BytesLike,
      _amount: BigNumberish,
      _receiver: string,
      _timestamp: BigNumberish,
      ancillaryData: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    umaHaltOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>
  }
}

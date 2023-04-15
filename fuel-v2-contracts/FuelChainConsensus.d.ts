/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface FuelChainConsensusInterface extends ethers.utils.Interface {
  functions: {
    "BLOCKS_PER_COMMIT_INTERVAL()": FunctionFragment;
    "COMMITTER_ROLE()": FunctionFragment;
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "NUM_COMMIT_SLOTS()": FunctionFragment;
    "PAUSER_ROLE()": FunctionFragment;
    "TIME_TO_FINALIZE()": FunctionFragment;
    "blockHashAtCommit(uint256)": FunctionFragment;
    "commit(bytes32,uint256)": FunctionFragment;
    "finalized(bytes32,uint256)": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "initialize()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "proxiableUUID()": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "unpause()": FunctionFragment;
    "upgradeTo(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "BLOCKS_PER_COMMIT_INTERVAL",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "COMMITTER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "NUM_COMMIT_SLOTS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PAUSER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "TIME_TO_FINALIZE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "blockHashAtCommit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "commit",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "finalized",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(functionFragment: "upgradeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [string, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "BLOCKS_PER_COMMIT_INTERVAL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "COMMITTER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "NUM_COMMIT_SLOTS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PAUSER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "TIME_TO_FINALIZE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blockHashAtCommit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "commit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "finalized", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "BeaconUpgraded(address)": EventFragment;
    "CommitSubmitted(uint256,bytes32)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "Paused(address)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "Unpaused(address)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CommitSubmitted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export class FuelChainConsensus extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: FuelChainConsensusInterface;

  functions: {
    BLOCKS_PER_COMMIT_INTERVAL(overrides?: CallOverrides): Promise<[BigNumber]>;

    "BLOCKS_PER_COMMIT_INTERVAL()"(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    COMMITTER_ROLE(overrides?: CallOverrides): Promise<[string]>;

    "COMMITTER_ROLE()"(overrides?: CallOverrides): Promise<[string]>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    "DEFAULT_ADMIN_ROLE()"(overrides?: CallOverrides): Promise<[string]>;

    NUM_COMMIT_SLOTS(overrides?: CallOverrides): Promise<[BigNumber]>;

    "NUM_COMMIT_SLOTS()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    PAUSER_ROLE(overrides?: CallOverrides): Promise<[string]>;

    "PAUSER_ROLE()"(overrides?: CallOverrides): Promise<[string]>;

    TIME_TO_FINALIZE(overrides?: CallOverrides): Promise<[BigNumber]>;

    "TIME_TO_FINALIZE()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    blockHashAtCommit(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "blockHashAtCommit(uint256)"(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    commit(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "commit(bytes32,uint256)"(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    finalized(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "finalized(bytes32,uint256)"(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    "getRoleAdmin(bytes32)"(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "grantRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "hasRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "initialize()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "pause()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    "paused()"(overrides?: CallOverrides): Promise<[boolean]>;

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

    "proxiableUUID()"(overrides?: CallOverrides): Promise<[string]>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "renounceRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "revokeRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "supportsInterface(bytes4)"(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "unpause()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "upgradeTo(address)"(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "upgradeToAndCall(address,bytes)"(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  BLOCKS_PER_COMMIT_INTERVAL(overrides?: CallOverrides): Promise<BigNumber>;

  "BLOCKS_PER_COMMIT_INTERVAL()"(overrides?: CallOverrides): Promise<BigNumber>;

  COMMITTER_ROLE(overrides?: CallOverrides): Promise<string>;

  "COMMITTER_ROLE()"(overrides?: CallOverrides): Promise<string>;

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  "DEFAULT_ADMIN_ROLE()"(overrides?: CallOverrides): Promise<string>;

  NUM_COMMIT_SLOTS(overrides?: CallOverrides): Promise<BigNumber>;

  "NUM_COMMIT_SLOTS()"(overrides?: CallOverrides): Promise<BigNumber>;

  PAUSER_ROLE(overrides?: CallOverrides): Promise<string>;

  "PAUSER_ROLE()"(overrides?: CallOverrides): Promise<string>;

  TIME_TO_FINALIZE(overrides?: CallOverrides): Promise<BigNumber>;

  "TIME_TO_FINALIZE()"(overrides?: CallOverrides): Promise<BigNumber>;

  blockHashAtCommit(
    commitHeight: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "blockHashAtCommit(uint256)"(
    commitHeight: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  commit(
    blockHash: BytesLike,
    commitHeight: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "commit(bytes32,uint256)"(
    blockHash: BytesLike,
    commitHeight: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  finalized(
    blockHash: BytesLike,
    blockHeight: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "finalized(bytes32,uint256)"(
    blockHash: BytesLike,
    blockHeight: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  "getRoleAdmin(bytes32)"(
    role: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "grantRole(bytes32,address)"(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "hasRole(bytes32,address)"(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  initialize(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "initialize()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  pause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "pause()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  "paused()"(overrides?: CallOverrides): Promise<boolean>;

  proxiableUUID(overrides?: CallOverrides): Promise<string>;

  "proxiableUUID()"(overrides?: CallOverrides): Promise<string>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "renounceRole(bytes32,address)"(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "revokeRole(bytes32,address)"(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "supportsInterface(bytes4)"(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  unpause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "unpause()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "upgradeTo(address)"(
    newImplementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "upgradeToAndCall(address,bytes)"(
    newImplementation: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    BLOCKS_PER_COMMIT_INTERVAL(overrides?: CallOverrides): Promise<BigNumber>;

    "BLOCKS_PER_COMMIT_INTERVAL()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    COMMITTER_ROLE(overrides?: CallOverrides): Promise<string>;

    "COMMITTER_ROLE()"(overrides?: CallOverrides): Promise<string>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    "DEFAULT_ADMIN_ROLE()"(overrides?: CallOverrides): Promise<string>;

    NUM_COMMIT_SLOTS(overrides?: CallOverrides): Promise<BigNumber>;

    "NUM_COMMIT_SLOTS()"(overrides?: CallOverrides): Promise<BigNumber>;

    PAUSER_ROLE(overrides?: CallOverrides): Promise<string>;

    "PAUSER_ROLE()"(overrides?: CallOverrides): Promise<string>;

    TIME_TO_FINALIZE(overrides?: CallOverrides): Promise<BigNumber>;

    "TIME_TO_FINALIZE()"(overrides?: CallOverrides): Promise<BigNumber>;

    blockHashAtCommit(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "blockHashAtCommit(uint256)"(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    commit(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "commit(bytes32,uint256)"(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    finalized(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "finalized(bytes32,uint256)"(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    "getRoleAdmin(bytes32)"(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "grantRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "hasRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initialize(overrides?: CallOverrides): Promise<void>;

    "initialize()"(overrides?: CallOverrides): Promise<void>;

    pause(overrides?: CallOverrides): Promise<void>;

    "pause()"(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    "paused()"(overrides?: CallOverrides): Promise<boolean>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    "proxiableUUID()"(overrides?: CallOverrides): Promise<string>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "renounceRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "revokeRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "supportsInterface(bytes4)"(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    unpause(overrides?: CallOverrides): Promise<void>;

    "unpause()"(overrides?: CallOverrides): Promise<void>;

    upgradeTo(
      newImplementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "upgradeTo(address)"(
      newImplementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "upgradeToAndCall(address,bytes)"(
      newImplementation: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    AdminChanged(
      previousAdmin: null,
      newAdmin: null
    ): TypedEventFilter<
      [string, string],
      { previousAdmin: string; newAdmin: string }
    >;

    BeaconUpgraded(
      beacon: string | null
    ): TypedEventFilter<[string], { beacon: string }>;

    CommitSubmitted(
      commitHeight: BigNumberish | null,
      blockHash: null
    ): TypedEventFilter<
      [BigNumber, string],
      { commitHeight: BigNumber; blockHash: string }
    >;

    Initialized(version: null): TypedEventFilter<[number], { version: number }>;

    Paused(account: null): TypedEventFilter<[string], { account: string }>;

    RoleAdminChanged(
      role: BytesLike | null,
      previousAdminRole: BytesLike | null,
      newAdminRole: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    RoleGranted(
      role: BytesLike | null,
      account: string | null,
      sender: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role: BytesLike | null,
      account: string | null,
      sender: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    Unpaused(account: null): TypedEventFilter<[string], { account: string }>;

    Upgraded(
      implementation: string | null
    ): TypedEventFilter<[string], { implementation: string }>;
  };

  estimateGas: {
    BLOCKS_PER_COMMIT_INTERVAL(overrides?: CallOverrides): Promise<BigNumber>;

    "BLOCKS_PER_COMMIT_INTERVAL()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    COMMITTER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    "COMMITTER_ROLE()"(overrides?: CallOverrides): Promise<BigNumber>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    "DEFAULT_ADMIN_ROLE()"(overrides?: CallOverrides): Promise<BigNumber>;

    NUM_COMMIT_SLOTS(overrides?: CallOverrides): Promise<BigNumber>;

    "NUM_COMMIT_SLOTS()"(overrides?: CallOverrides): Promise<BigNumber>;

    PAUSER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    "PAUSER_ROLE()"(overrides?: CallOverrides): Promise<BigNumber>;

    TIME_TO_FINALIZE(overrides?: CallOverrides): Promise<BigNumber>;

    "TIME_TO_FINALIZE()"(overrides?: CallOverrides): Promise<BigNumber>;

    blockHashAtCommit(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "blockHashAtCommit(uint256)"(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    commit(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "commit(bytes32,uint256)"(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    finalized(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "finalized(bytes32,uint256)"(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getRoleAdmin(bytes32)"(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "grantRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "hasRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "initialize()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "pause()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    "paused()"(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

    "proxiableUUID()"(overrides?: CallOverrides): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "renounceRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "revokeRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "supportsInterface(bytes4)"(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "unpause()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "upgradeTo(address)"(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "upgradeToAndCall(address,bytes)"(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    BLOCKS_PER_COMMIT_INTERVAL(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "BLOCKS_PER_COMMIT_INTERVAL()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    COMMITTER_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "COMMITTER_ROLE()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "DEFAULT_ADMIN_ROLE()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    NUM_COMMIT_SLOTS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "NUM_COMMIT_SLOTS()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    PAUSER_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "PAUSER_ROLE()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    TIME_TO_FINALIZE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "TIME_TO_FINALIZE()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    blockHashAtCommit(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "blockHashAtCommit(uint256)"(
      commitHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    commit(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "commit(bytes32,uint256)"(
      blockHash: BytesLike,
      commitHeight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    finalized(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "finalized(bytes32,uint256)"(
      blockHash: BytesLike,
      blockHeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getRoleAdmin(bytes32)"(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "grantRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "hasRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "initialize()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "pause()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "paused()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "proxiableUUID()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "renounceRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "revokeRole(bytes32,address)"(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "supportsInterface(bytes4)"(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "unpause()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "upgradeTo(address)"(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "upgradeToAndCall(address,bytes)"(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}

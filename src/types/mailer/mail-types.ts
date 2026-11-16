/**
 * @fileoverview Mailbox contract response types for multi-chain messaging system
 *
 * This module contains all structured response types for the MailBox protocol
 * including EVM and Solana implementations. These types provide type safety
 * and consistent structure for all client interactions.
 */

import {
  ChainType,
  type Optional,
  type BaseResponse,
  type PaginatedResponse,
  type MessageBase,
  type UnifiedError,
} from '@sudobility/types';

// =======================
// Enums
// =======================

/**
 * Transaction confirmation status levels.
 *
 * Represents the progression of a blockchain transaction from initial
 * processing through to finalization. On EVM chains these map to
 * block confirmations; on Solana they map to commitment levels
 * (processed -> confirmed -> finalized).
 */
export enum ConfirmationStatus {
  /** Transaction has been processed but not yet included in a confirmed block. On Solana: "processed" commitment. */
  Processed = 'processed',
  /** Transaction has been confirmed in a block with sufficient confirmations. On Solana: "confirmed" commitment. */
  Confirmed = 'confirmed',
  /** Transaction has been finalized and is irreversible. On Solana: "finalized" commitment. */
  Finalized = 'finalized',
}

/**
 * Types of revenue claims in the mailbox contract.
 *
 * When priority messages are sent, a portion of the fee becomes
 * claimable revenue. This enum identifies who is claiming and under
 * what conditions.
 */
export enum ClaimType {
  /** Claim by the message recipient. Revenue share from priority messages received. */
  Recipient = 'recipient',
  /** Claim by the contract owner. Protocol fees and unclaimed revenue. */
  Owner = 'owner',
  /** Claim of expired revenue. Revenue that was not claimed before its expiry timestamp. */
  Expired = 'expired',
}

/**
 * Fee types in the mailbox contract.
 *
 * Each operation in the mailbox protocol incurs a specific fee type.
 * Fee amounts are denominated in micro-USDC and can be updated by
 * the contract owner.
 */
export enum FeeType {
  /** Fee for sending messages. Charged per message sent through the mailbox contract. */
  Send = 'send',
  /** Fee for delegation operations. Charged when delegating mailbox access to another address. */
  Delegation = 'delegation',
  /** Fee for domain registration. Charged when registering or extending a mailbox domain name. */
  Registration = 'registration',
}

// =======================
// Core Response Types
// =======================

/**
 * Base response structure for all blockchain operations.
 *
 * Every on-chain operation in the mailbox protocol returns at minimum
 * a transaction hash, chain type, and success indicator. Extended by
 * {@link TransactionReceipt} for richer block-level details.
 */
export interface BaseTransactionResponse {
  /** Transaction hash/signature */
  transactionHash: string;
  /** Blockchain type where transaction occurred */
  chainType: ChainType.EVM | ChainType.SOLANA;
  /** Timestamp when transaction was created (Unix timestamp in ms) */
  timestamp?: Optional<number>;
  /** Whether the transaction was successful */
  success: boolean;
  /** Error message if transaction failed */
  error?: Optional<string>;
}

/**
 * Enhanced transaction response with block-level information.
 *
 * Extends {@link BaseTransactionResponse} with block number, slot,
 * gas usage, and confirmation status. This is the base for most
 * operation-specific response types like {@link MessageSendResponse}.
 */
export interface TransactionReceipt extends BaseTransactionResponse {
  /** Block number (EVM) or slot (Solana) */
  blockNumber?: Optional<number>;
  /** Solana slot number */
  slot?: Optional<number>;
  /** Gas used for EVM transactions */
  gasUsed?: Optional<bigint>;
  /** Transaction confirmation status */
  confirmationStatus?: Optional<ConfirmationStatus>;
}

// =======================
// Message Operations
// =======================

/**
 * Response for message sending operations.
 *
 * Returned after a message is sent through the mailbox contract.
 * Includes the fee paid, priority status, and any claimable revenue
 * share for the recipient if the message was sent as priority.
 */
export interface MessageSendResponse extends TransactionReceipt {
  /** Message identifier (if available) */
  messageId?: Optional<string>;
  /** Fee paid for sending the message */
  fee: bigint | number;
  /** Recipient address */
  recipient?: Optional<string>;
  /** Message subject */
  subject?: Optional<string>;
  /** Message body */
  body?: Optional<string>;
  /** Whether this was a priority message */
  isPriority: boolean;
  /** Revenue share amount claimable by recipient (for priority messages) */
  claimableRevenue?: Optional<bigint | number>;
  /** Expiry timestamp for revenue claims */
  claimExpiryTimestamp?: Optional<number>;
}

/**
 * Response for pre-prepared message sending.
 *
 * Returned when sending a message that was previously prepared and
 * stored off-chain. The mailId links back to the prepared message.
 */
export interface PreparedMessageSendResponse extends TransactionReceipt {
  /** Pre-prepared message identifier */
  mailId: string;
  /** Fee paid for sending */
  fee: bigint | number;
  /** Recipient address */
  recipient: string;
  /** Whether this was a priority prepared message */
  isPriority: boolean;
  /** Revenue share amount claimable by recipient */
  claimableRevenue?: Optional<bigint | number>;
}

// =======================
// Revenue & Claims
// =======================

/**
 * Information about claimable revenue shares.
 *
 * Describes a revenue share that can be claimed from the mailbox contract.
 * Revenue shares are created when priority messages are sent and expire
 * after a configurable time period.
 */
export interface ClaimableInfo {
  /** Amount available to claim */
  amount: bigint | number;
  /** Timestamp when claim expires (Unix timestamp in ms) */
  expiryTimestamp: number;
  /** Whether the claim has expired */
  isExpired: boolean;
  /** Whether claim is still valid */
  isClaimable: boolean;
}

/**
 * Response for revenue claim operations.
 *
 * Returned after claiming revenue from the mailbox contract. Includes
 * the claimed amount, remaining balance, and the type of claim made.
 */
export interface ClaimRevenueResponse extends TransactionReceipt {
  /** Amount claimed */
  claimedAmount: bigint | number;
  /** Remaining claimable amount */
  remainingAmount: bigint | number;
  /** Type of claim */
  claimType: ClaimType;
}

/**
 * Response for checking claimable amounts.
 *
 * Provides a snapshot of all claimable revenue for a given address,
 * broken down by recipient and owner shares.
 */
export interface ClaimableAmountResponse {
  /** Recipient claimable information */
  recipientClaimable: ClaimableInfo;
  /** Owner claimable amount */
  ownerClaimable: bigint | number;
  /** Last updated timestamp */
  lastUpdated: number;
}

// =======================
// Domain & Delegation
// =======================

/**
 * Response for domain registration operations.
 *
 * Returned after registering or extending a mailbox domain name.
 * Domain registration binds a human-readable name to a wallet address.
 */
export interface DomainRegistrationResponse extends TransactionReceipt {
  /** Registered domain name */
  domain: string;
  /** Domain expiry timestamp */
  expiryTimestamp: number;
  /** Registration fee paid */
  fee: bigint | number;
  /** Whether this was an extension of existing domain */
  isExtension: boolean;
}

/**
 * Response for delegation operations.
 *
 * Returned after delegating mailbox access to another address. Delegation
 * allows a delegate to send and receive messages on behalf of the delegator.
 */
export interface MailboxDelegationResponse extends TransactionReceipt {
  /** Address that created the delegation */
  delegator: string;
  /** Address that was delegated to */
  delegate: string;
  /** Delegation fee paid */
  fee: bigint | number;
  /** Whether this cleared an existing delegation */
  isClearing: boolean;
}

/**
 * Response for delegation rejection operations.
 *
 * Returned when a delegate rejects an incoming delegation request.
 * The delegate can choose not to accept mailbox access from the delegator.
 */
export interface DelegationRejectionResponse extends TransactionReceipt {
  /** Address that rejected the delegation */
  rejector: string;
  /** Address that was trying to delegate */
  delegatingAddress: string;
}

// =======================
// Fee Management
// =======================

/**
 * Current fee information for the mailbox contract.
 *
 * Contains the current fee amounts for all operations. Fees are
 * denominated in micro-USDC (1 USDC = 1,000,000 micro-USDC).
 */
export interface FeeInfo {
  /** Current send fee (in micro-USDC) */
  sendFee: bigint | number;
  /** Current delegation fee (in micro-USDC) */
  delegationFee: bigint | number;
  /** Current domain registration fee (in micro-USDC) */
  registrationFee?: Optional<bigint | number>;
  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * Response for fee update operations.
 *
 * Returned after the contract owner updates a fee amount. Includes
 * the previous and new fee values for audit purposes.
 */
export interface FeeUpdateResponse extends TransactionReceipt {
  /** Type of fee that was updated */
  feeType: FeeType;
  /** Previous fee amount */
  oldFee: bigint | number;
  /** New fee amount */
  newFee: bigint | number;
}

// =======================
// Contract State
// =======================

/**
 * Contract pause status information.
 *
 * Reports whether the mailbox contract is currently paused.
 * When paused, no new messages can be sent and no revenue can be claimed.
 */
export interface PauseInfo {
  /** Whether the contract is currently paused */
  isPaused: boolean;
  /** Timestamp when pause was activated */
  pausedAt?: Optional<number>;
  /** Address that initiated the pause */
  pausedBy?: Optional<string>;
}

/**
 * Response for pause/unpause operations.
 *
 * Returned after the contract owner pauses or unpauses the contract.
 * Emergency pauses bypass normal governance timelock requirements.
 */
export interface PauseResponse extends TransactionReceipt {
  /** New pause status */
  isPaused: boolean;
  /** Whether this was an emergency pause */
  isEmergency?: Optional<boolean>;
}

/**
 * Emergency fund distribution response.
 *
 * Returned after an emergency fund distribution is executed by the
 * contract owner. Used to distribute contract funds in emergency scenarios.
 */
export interface EmergencyDistributionResponse extends TransactionReceipt {
  /** Amount distributed */
  distributedAmount: bigint | number;
  /** Recipients of the distribution */
  recipients: string[];
}

// =======================
// Chain-Specific Types
// =======================

/**
 * EVM-specific transaction response.
 *
 * Extends {@link TransactionReceipt} with EVM-specific fields such as
 * block number, gas usage, gas price, and deployed contract address.
 * The `chainType` is narrowed to `ChainType.EVM`.
 */
export interface EVMTransactionResponse extends TransactionReceipt {
  chainType: ChainType.EVM;
  /** EVM block number */
  blockNumber: number;
  /** Gas used */
  gasUsed: bigint;
  /** Gas price */
  gasPrice?: Optional<bigint>;
  /** Contract address for deployment transactions */
  contractAddress?: Optional<string>;
}

/**
 * Solana-specific transaction response.
 *
 * Extends {@link TransactionReceipt} with Solana-specific fields such as
 * slot number, compute units consumed, and transaction fee in lamports.
 * The `chainType` is narrowed to `ChainType.SOLANA`.
 */
export interface SolanaTransactionResponse extends TransactionReceipt {
  chainType: ChainType.SOLANA;
  /** Solana slot number */
  slot: number;
  /** Compute units consumed */
  computeUnitsConsumed?: Optional<number>;
  /** Transaction fee in lamports */
  transactionFee?: Optional<number>;
}

// =======================
// Client Response Types
// =======================

/**
 * Unified client response for cross-chain operations.
 *
 * Wraps the standard {@link BaseResponse} with chain-specific metadata.
 * Used by the client library to provide a consistent interface across
 * EVM and Solana chains.
 */
export interface UnifiedClientResponse<T = unknown> extends BaseResponse<T> {
  /** Chain where operation occurred */
  chainType: ChainType.EVM | ChainType.SOLANA;
  /** Request metadata */
  metadata?: Optional<{
    requestId?: Optional<string>;
    duration?: Optional<number>;
  }>;
}

/**
 * Batch operation response.
 *
 * Returned when executing multiple operations in a single transaction
 * (e.g., sending multiple messages). Includes per-operation results
 * and aggregate success/failure counts.
 */
export interface BatchOperationResponse extends BaseTransactionResponse {
  /** Results for each operation in the batch */
  results: Array<{
    success: boolean;
    data?: Optional<unknown>;
    error?: Optional<string>;
  }>;
  /** Number of successful operations */
  successCount: number;
  /** Number of failed operations */
  failureCount: number;
}

// =======================
// Query Response Types
// =======================

/**
 * Message history item structure.
 *
 * Represents a single message in the user's message history query.
 * Extends {@link MessageBase} with on-chain transaction details.
 */
export interface MessageHistoryItem extends MessageBase {
  messageId: string;
  transactionHash: string;
  timestamp: number;
  isPriority: boolean;
  fee: bigint | number;
}

/**
 * Response for querying message history.
 *
 * Paginated list of {@link MessageHistoryItem} entries. Extends
 * {@link PaginatedResponse} from `@sudobility/types`.
 */
export interface MessageHistoryResponse extends PaginatedResponse<MessageHistoryItem> {}

/**
 * Response for querying delegation status.
 *
 * Provides a comprehensive view of an address's delegation state,
 * including outgoing delegation, incoming delegations, and total fees paid.
 */
export interface DelegationStatusResponse {
  /** Current delegation target (null if no delegation) */
  currentDelegate?: Optional<string>;
  /** Timestamp when delegation was set */
  delegatedAt?: Optional<number>;
  /** Addresses that have delegated to this address */
  incomingDelegations: string[];
  /** Total delegation fee paid */
  totalDelegationFees: bigint | number;
}

// =======================
// Error Types
// =======================

/**
 * Contract error type.
 *
 * Re-export of {@link UnifiedError} from `@sudobility/types`. Used to
 * represent errors originating from smart contract interactions on
 * both EVM and Solana chains.
 */
export type ContractError = UnifiedError;

// =======================
// Type Guards
// =======================

/**
 * Type guard to check if response is EVM-specific
 */
export function isEVMResponse(
  response: TransactionReceipt
): response is EVMTransactionResponse {
  return response.chainType === ChainType.EVM;
}

/**
 * Type guard to check if response is Solana-specific
 */
export function isSolanaResponse(
  response: TransactionReceipt
): response is SolanaTransactionResponse {
  return response.chainType === ChainType.SOLANA;
}

/**
 * Type guard to check if response contains an error
 */
export function isMailboxErrorResponse(
  response: UnifiedClientResponse
): response is UnifiedClientResponse & {
  error: NonNullable<UnifiedClientResponse['error']>;
} {
  return !response.success && response.error !== undefined;
}

/**
 * Type guard to check if a value is a valid ConfirmationStatus
 */
export function isConfirmationStatus(
  value: unknown
): value is ConfirmationStatus {
  return (
    typeof value === 'string' &&
    Object.values(ConfirmationStatus).includes(value as ConfirmationStatus)
  );
}

/**
 * Type guard to check if a value is a valid ClaimType
 */
export function isClaimType(value: unknown): value is ClaimType {
  return (
    typeof value === 'string' &&
    Object.values(ClaimType).includes(value as ClaimType)
  );
}

/**
 * Type guard to check if a value is a valid FeeType
 */
export function isFeeType(value: unknown): value is FeeType {
  return (
    typeof value === 'string' &&
    Object.values(FeeType).includes(value as FeeType)
  );
}

/**
 * Type guard to check if response is a BaseTransactionResponse
 */
export function isBaseTransactionResponse(
  response: unknown
): response is BaseTransactionResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'transactionHash' in response &&
    'chainType' in response &&
    'success' in response &&
    typeof (response as BaseTransactionResponse).transactionHash === 'string' &&
    typeof (response as BaseTransactionResponse).success === 'boolean'
  );
}

/**
 * Type guard to check if response is a MessageSendResponse
 */
export function isMessageSendResponse(
  response: unknown
): response is MessageSendResponse {
  return (
    isBaseTransactionResponse(response) &&
    'fee' in response &&
    'isPriority' in response &&
    typeof (response as MessageSendResponse).isPriority === 'boolean'
  );
}

/**
 * Type guard to check if response is a ClaimableInfo
 */
export function isClaimableInfo(value: unknown): value is ClaimableInfo {
  return (
    typeof value === 'object' &&
    value !== null &&
    'amount' in value &&
    'expiryTimestamp' in value &&
    'isExpired' in value &&
    'isClaimable' in value &&
    typeof (value as ClaimableInfo).expiryTimestamp === 'number' &&
    typeof (value as ClaimableInfo).isExpired === 'boolean' &&
    typeof (value as ClaimableInfo).isClaimable === 'boolean'
  );
}

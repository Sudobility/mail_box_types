/**
 * API Response Type Definitions for Mail Box Indexer
 * @description Comprehensive type definitions for all indexer API endpoints
 */

import type { Optional, ChainType, WalletData, ApiResponse } from '@sudobility/types';
import type {
  InitiateKYCResponse,
  GetKYCStatusResponse,
} from '../kyc/kyc-types.js';

// Name service account
export interface IndexerNameServiceAccount {
  name: string;
  entitled: boolean;
}

// Email address aggregation types
export interface IndexerWalletAccount extends WalletData {
  names: IndexerNameServiceAccount[];
  /**
   * User-defined custom address local-part (lowercased) this wallet has set,
   * if any (feature: user-defined addresses). The full email is
   * `${customAddress}@${emailDomain}`.
   */
  customAddress?: Optional<string>;
}

export interface IndexerEmailAccountsResult {
  accounts: IndexerWalletAccount[];
}

export type IndexerEmailAccountsResponse =
  ApiResponse<IndexerEmailAccountsResult>;

// Custom (user-defined) address types
/** Which name service claims a given postfix. */
export type NameServiceKind = 'ENS' | 'SNS';

/** Reasons a desired custom address can be rejected. */
export type CustomAddressRejectReason =
  | 'taken' // already claimed by another user
  | 'reserved' // system-reserved / blocklisted name
  | 'wallet_address' // parses as a wallet-address string
  | 'name_service_postfix' // postfix is an ENS/SNS postfix (rule 2)
  | 'invalid_format' // fails normal email local-part rules
  | 'no_credits' // user has already used their set allowance (rule 3)
  | 'already_set'; // user already has an active custom address

/** Current custom-address state for a wallet. */
export interface IndexerCustomAddressData extends WalletData {
  /** The user-defined local part (e.g. "john"), lowercased; null if none set. */
  customAddress: Optional<string>;
  /**
   * Remaining number of times the user may (re)set a custom address.
   * Starts at 1; a rule-4 auto-clear grants one more.
   */
  creditsRemaining: number;
}

export type IndexerCustomAddressResponse =
  ApiResponse<IndexerCustomAddressData>;

/** Availability result for a desired custom address local part. */
export interface IndexerCustomAddressAvailabilityData {
  /** The normalized (lowercased) local part that was checked. */
  name: string;
  available: boolean;
  /** Present when available === false. */
  reason?: Optional<CustomAddressRejectReason>;
  /** For `name_service_postfix` rejections: which service claims the postfix. */
  service?: Optional<NameServiceKind>;
}

export type IndexerCustomAddressAvailabilityResponse =
  ApiResponse<IndexerCustomAddressAvailabilityData>;

/** Request body for setting a wallet's custom address. */
export interface IndexerSetCustomAddressRequest {
  /** Desired custom address local part (lowercased server-side). */
  address: string;
}

// Rewards history record
export interface IndexerRewardData {
  walletAddress: string;
  action: string;
  points: number;
  earningTime: string;
}

export interface IndexerRewardHistoryData {
  rewards: IndexerRewardData[];
  records: number;
  points: number;
}

export type IndexerRewardsResponse = ApiResponse<IndexerRewardHistoryData>;

// Address validation types
export interface IndexerAddressValidationData extends WalletData {
  name?: Optional<string>;
}

export type IndexerAddressValidationResponse =
  ApiResponse<IndexerAddressValidationData>;

// Delegation types
export interface IndexerDelegateData extends WalletData {
  chainId?: Optional<number>;
  txHash?: Optional<string>;
}

export type IndexerDelegatedToResponse = ApiResponse<IndexerDelegateData>;

export interface IndexerDelegatedFromData {
  from: IndexerDelegateData[];
}

export type IndexerDelegatedFromResponse =
  ApiResponse<IndexerDelegatedFromData>;

// Nonce types
export interface IndexerNonceData {
  nonce: string;
}

export type IndexerNonceResponse = ApiResponse<IndexerNonceData>;

// Entitlement types
export interface IndexerEntitlementInfo {
  type: 'nameservice';
  hasEntitlement: boolean;
  isActive: boolean;
  productIdentifier?: Optional<string>;
  expiresDate?: Optional<string>;
  store?: Optional<string>;
}

export interface IndexerEntitlementData extends WalletData {
  entitlement: IndexerEntitlementInfo;
  message: string;
  verified: boolean;
}

export type IndexerEntitlementResponse = ApiResponse<IndexerEntitlementData>;

// Message generation types
export interface IndexerSignInMessageData extends WalletData {
  message: string;
  chainId?: Optional<number>;
}

export type IndexerSignInMessageResponse =
  ApiResponse<IndexerSignInMessageData>;

// Points types - consolidated user points data
export interface IndexerPointsData extends WalletData {
  pointsEarned: string;
  totalActivities: number;
  leaderboardRank: number | null;
  lastActivityDate?: Optional<string>;
  createdAt?: Optional<string>;
  updatedAt?: Optional<string>;
}

export type IndexerPointsResponse = ApiResponse<IndexerPointsData>;

// Points API response types
export interface IndexerLeaderboardData {
  leaderboard: IndexerPointsData[];
}

export type IndexerLeaderboardResponse = ApiResponse<IndexerLeaderboardData>;

export interface IndexerSiteStatsData {
  totalPoints: string;
  totalUsers: number;
  lastUpdated?: Optional<string>;
}

export type IndexerSiteStatsResponse = ApiResponse<IndexerSiteStatsData>;

// Referral code types
export interface IndexerReferralCodeData {
  /** Wallet address (EVM 0x format or Solana Base58) */
  walletAddress: string;
  referralCode: string;
  createdAt: string;
  /** Total number of wallets that used this referral code */
  totalReferrals: number;
}

export type IndexerReferralCodeResponse = ApiResponse<IndexerReferralCodeData>;

export interface IndexerReferralConsumptionData {
  /** Wallet address (EVM 0x format or Solana Base58) */
  walletAddress: string;
  /** Can be "" if no referral code is used */
  referralCode: string;
  createdAt: string;
}

export interface IndexerReferralStatsData {
  total: number;
  consumptions: IndexerReferralConsumptionData[];
}

export type IndexerReferralStatsResponse =
  ApiResponse<IndexerReferralStatsData>;

// Authentication status types
export interface IndexerAuthenticationStatusData {
  authenticated: boolean;
  datetime?: Optional<string>;
}

export type IndexerAuthenticationStatusResponse =
  ApiResponse<IndexerAuthenticationStatusData>;

// Block status types
export interface IndexerChainBlockInfo {
  chain: string;
  chainId: number;
  currentBlock: string | null;
  indexedBlock: string | null;
  percentage: string | null;
  blocksBehind: string | null;
  rpcUrl: string | null;
  status: 'synced' | 'syncing' | 'error';
  error?: Optional<string>;
}

export interface IndexerBlockStatusData {
  chains: IndexerChainBlockInfo[];
  totalChains: number;
  syncedChains: number;
  overallHealth: 'healthy' | 'syncing' | 'degraded';
  summary: {
    syncedCount: number;
    syncingCount: number;
    errorCount: number;
  };
  timestamp: string;
}

export type IndexerBlockStatusResponse = ApiResponse<IndexerBlockStatusData>;

// Name service resolution types
export interface IndexerNameServiceData {
  names: string[];
}

export type IndexerNameServiceResponse = ApiResponse<IndexerNameServiceData>;

export interface IndexerNameResolutionData extends WalletData {}

export type IndexerNameResolutionResponse =
  ApiResponse<IndexerNameResolutionData>;

// Email template types
export interface IndexerTemplateData {
  id: string;
  userId: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IndexerTemplateResult {
  template: IndexerTemplateData;
  verified: boolean;
}

export type IndexerTemplateResponse = ApiResponse<IndexerTemplateResult>;

export interface IndexerTemplateListResult {
  templates: IndexerTemplateData[];
  total: number;
  hasMore: boolean;
  verified: boolean;
}

export type IndexerTemplateListResponse =
  ApiResponse<IndexerTemplateListResult>;

export interface IndexerTemplateDeleteResult {
  message: string;
  verified: boolean;
}

export type IndexerTemplateDeleteResponse =
  ApiResponse<IndexerTemplateDeleteResult>;

// Template request types
export interface IndexerTemplateCreateRequest {
  name: string;
  subject: string;
  body: string;
}

export interface IndexerTemplateUpdateRequest {
  name?: string;
  subject?: string;
  body?: string;
}

// Webhook types
export interface IndexerWebhookData {
  id: string;
  userId: string;
  webhookUrl: string;
  isActive: boolean;
  lastTriggeredAt: string | null;
  triggerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexerWebhookResult {
  webhook: IndexerWebhookData;
  verified: boolean;
}

export type IndexerWebhookResponse = ApiResponse<IndexerWebhookResult>;

export interface IndexerWebhookListResult {
  webhooks: IndexerWebhookData[];
  total: number;
  hasMore: boolean;
  verified: boolean;
}

export type IndexerWebhookListResponse = ApiResponse<IndexerWebhookListResult>;

export interface IndexerWebhookDeleteResult {
  message: string;
  verified: boolean;
}

export type IndexerWebhookDeleteResponse =
  ApiResponse<IndexerWebhookDeleteResult>;

// Webhook request types
export interface IndexerWebhookCreateRequest {
  webhookUrl: string;
}

// Contract permissions types
export interface IndexerContractPermissionsData {
  contractAddress: string;
  chainId: number;
  testNet: boolean;
  wallets: string[];
  count: number;
}

export type IndexerContractPermissionsResponse =
  ApiResponse<IndexerContractPermissionsData>;

// Wallet permissions types
export interface IndexerWalletPermissionsData {
  walletAddress: string;
  chainId: number;
  testNet: boolean;
  contracts: string[];
  count: number;
}

export type IndexerWalletPermissionsResponse =
  ApiResponse<IndexerWalletPermissionsData>;

// Points info types (composite GET /points response)
export interface IndexerPointsInfoSiteStats {
  totalPoints: string;
  totalUsers: number;
  lastUpdated: string;
}

export interface IndexerPointsInfoTopUser {
  walletAddress: string;
  pointsEarned: string;
  rank: number;
}

export interface IndexerPointsInfoData {
  siteStats: IndexerPointsInfoSiteStats;
  topUsers: IndexerPointsInfoTopUser[];
}

export type IndexerPointsInfoResponse = ApiResponse<IndexerPointsInfoData>;

// 3DNS domain resolution types
export interface IndexerThreeDnsResolutionData {
  domainName: string;
  walletAddress: string;
  chainType: ChainType;
}

export type IndexerThreeDnsResolutionResponse =
  ApiResponse<IndexerThreeDnsResolutionData>;

// Recalculate site stats response
export interface IndexerRecalculateData {
  message: string;
  siteStats: IndexerPointsInfoSiteStats;
}

export type IndexerRecalculateResponse = ApiResponse<IndexerRecalculateData>;

// Authenticate endpoint response
export interface IndexerAuthenticateData {
  message: string;
}

export type IndexerAuthenticateResponse = ApiResponse<IndexerAuthenticateData>;

// Verify endpoint response
export interface IndexerVerifyData {
  success: boolean;
}

export type IndexerVerifyResponse = ApiResponse<IndexerVerifyData>;

// KYC API response wrappers (wrap KYC-specific types in ApiResponse)
export type IndexerKYCInitiateResponse = ApiResponse<InitiateKYCResponse>;

export type IndexerKYCStatusResponse = ApiResponse<GetKYCStatusResponse>;

export interface IndexerKYCWebhookData {
  success: boolean;
}

export type IndexerKYCWebhookResponse = ApiResponse<IndexerKYCWebhookData>;

// Solana API response types
export interface IndexerSolanaWebhookData {
  processed: number;
  total: number;
}

export type IndexerSolanaWebhookResponse =
  ApiResponse<IndexerSolanaWebhookData>;

export interface IndexerSolanaSetupResult {
  chainId: string;
  status: 'success' | 'error';
  error?: Optional<string>;
}

export interface IndexerSolanaSetupData {
  results: IndexerSolanaSetupResult[];
}

export type IndexerSolanaSetupResponse = ApiResponse<IndexerSolanaSetupData>;

export interface IndexerSolanaIndexerStatus {
  chainId: number;
  initialized: boolean;
  networkName: string;
}

export interface IndexerSolanaStatusData {
  solanaIndexers: IndexerSolanaIndexerStatus[];
  totalIndexers: number;
  configured: boolean;
}

export type IndexerSolanaStatusResponse = ApiResponse<IndexerSolanaStatusData>;

export interface IndexerSolanaTestTransactionData {
  message: string;
}

export type IndexerSolanaTestTransactionResponse =
  ApiResponse<IndexerSolanaTestTransactionData>;

// OAuth response types
export interface IndexerOAuthChallengeData {
  challenge: string;
  session_id: string;
  expires_in: number;
  display_name: string;
  chain_type: string;
  wallet_address: string;
}

export type IndexerOAuthChallengeResponse =
  ApiResponse<IndexerOAuthChallengeData>;

export interface IndexerOAuthVerifyData {
  success: boolean;
  session_id: string;
}

export type IndexerOAuthVerifyResponse = ApiResponse<IndexerOAuthVerifyData>;

export interface IndexerOAuthAuthorizeData {
  success: boolean;
  redirect_url: string;
  code: string;
  state: string;
}

export type IndexerOAuthAuthorizeResponse =
  ApiResponse<IndexerOAuthAuthorizeData>;

export interface IndexerOAuthTokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: Optional<string>;
  scope?: Optional<string>;
}

export type IndexerOAuthTokenResponse = ApiResponse<IndexerOAuthTokenData>;

export interface IndexerOAuthUserInfoData {
  sub: string;
  email?: Optional<string>;
  email_verified?: Optional<boolean>;
  name?: Optional<string>;
  picture?: Optional<string>;
  wallet_address?: Optional<string>;
  chain_type?: Optional<string>;
  privacy_level?: Optional<string>;
}

export type IndexerOAuthUserInfoResponse =
  ApiResponse<IndexerOAuthUserInfoData>;

export interface IndexerOAuthClientInfoData {
  client_id: string;
  client_name: string;
  client_uri: string;
  scope: string;
  require_pkce: boolean;
}

export type IndexerOAuthClientInfoResponse =
  ApiResponse<IndexerOAuthClientInfoData>;

// Error response type for API endpoints
export interface IndexerErrorResponse extends ApiResponse<never> {
  success: false;
  error: string;
}

// Extended union type to include all response types
export type IndexerApiResponse =
  | IndexerAddressValidationResponse
  | IndexerEmailAccountsResponse
  | IndexerDelegatedToResponse
  | IndexerDelegatedFromResponse
  | IndexerNonceResponse
  | IndexerEntitlementResponse
  | IndexerPointsResponse
  | IndexerSignInMessageResponse
  | IndexerLeaderboardResponse
  | IndexerSiteStatsResponse
  | IndexerReferralCodeResponse
  | IndexerReferralStatsResponse
  | IndexerAuthenticationStatusResponse
  | IndexerBlockStatusResponse
  | IndexerNameServiceResponse
  | IndexerNameResolutionResponse
  | IndexerTemplateResponse
  | IndexerTemplateListResponse
  | IndexerTemplateDeleteResponse
  | IndexerWebhookResponse
  | IndexerWebhookListResponse
  | IndexerWebhookDeleteResponse
  | IndexerContractPermissionsResponse
  | IndexerWalletPermissionsResponse
  | IndexerPointsInfoResponse
  | IndexerThreeDnsResolutionResponse
  | IndexerRecalculateResponse
  | IndexerAuthenticateResponse
  | IndexerVerifyResponse
  | IndexerKYCInitiateResponse
  | IndexerKYCStatusResponse
  | IndexerKYCWebhookResponse
  | IndexerSolanaWebhookResponse
  | IndexerSolanaSetupResponse
  | IndexerSolanaStatusResponse
  | IndexerSolanaTestTransactionResponse
  | IndexerOAuthChallengeResponse
  | IndexerOAuthVerifyResponse
  | IndexerOAuthAuthorizeResponse
  | IndexerOAuthTokenResponse
  | IndexerOAuthUserInfoResponse
  | IndexerOAuthClientInfoResponse
  | IndexerErrorResponse;

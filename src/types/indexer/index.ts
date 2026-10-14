// Export all response types as named exports
export type {
  // Email account types
  IndexerNameServiceAccount,
  IndexerWalletAccount,
  IndexerEmailAccountsResult,
  IndexerEmailAccountsResponse,

  // Custom (user-defined) address types
  NameServiceKind,
  CustomAddressRejectReason,
  IndexerCustomAddressData,
  IndexerCustomAddressResponse,
  IndexerCustomAddressAvailabilityData,
  IndexerCustomAddressAvailabilityResponse,
  IndexerSetCustomAddressRequest,

  // Rewards types
  IndexerRewardData,
  IndexerRewardHistoryData,
  IndexerRewardsResponse,

  // Address validation types
  IndexerAddressValidationData,
  IndexerAddressValidationResponse,

  // Delegation types
  IndexerDelegateData,
  IndexerDelegatedToResponse,
  IndexerDelegatedFromData,
  IndexerDelegatedFromResponse,

  // Nonce types
  IndexerNonceData,
  IndexerNonceResponse,

  // Entitlement types
  IndexerEntitlementInfo,
  IndexerEntitlementData,
  IndexerEntitlementResponse,

  // Sign-in message types
  IndexerSignInMessageData,
  IndexerSignInMessageResponse,

  // Points types
  IndexerPointsData,
  IndexerPointsResponse,

  // Leaderboard types
  IndexerLeaderboardData,
  IndexerLeaderboardResponse,

  // Site stats types
  IndexerSiteStatsData,
  IndexerSiteStatsResponse,

  // Referral code types
  IndexerReferralCodeData,
  IndexerReferralCodeResponse,
  IndexerReferralConsumptionData,
  IndexerReferralStatsData,
  IndexerReferralStatsResponse,

  // Authentication status types
  IndexerAuthenticationStatusData,
  IndexerAuthenticationStatusResponse,

  // Block status types
  IndexerChainBlockInfo,
  IndexerBlockStatusData,
  IndexerBlockStatusResponse,

  // Name service resolution types
  IndexerNameServiceData,
  IndexerNameServiceResponse,
  IndexerNameResolutionData,
  IndexerNameResolutionResponse,

  // Email template types
  IndexerTemplateData,
  IndexerTemplateResult,
  IndexerTemplateResponse,
  IndexerTemplateListResult,
  IndexerTemplateListResponse,
  IndexerTemplateDeleteResult,
  IndexerTemplateDeleteResponse,
  IndexerTemplateCreateRequest,
  IndexerTemplateUpdateRequest,

  // Webhook types
  IndexerWebhookData,
  IndexerWebhookResult,
  IndexerWebhookResponse,
  IndexerWebhookListResult,
  IndexerWebhookListResponse,
  IndexerWebhookDeleteResult,
  IndexerWebhookDeleteResponse,
  IndexerWebhookCreateRequest,

  // Contract permissions types
  IndexerContractPermissionsData,
  IndexerContractPermissionsResponse,

  // Wallet permissions types
  IndexerWalletPermissionsData,
  IndexerWalletPermissionsResponse,

  // Points info types
  IndexerPointsInfoSiteStats,
  IndexerPointsInfoTopUser,
  IndexerPointsInfoData,
  IndexerPointsInfoResponse,

  // 3DNS resolution types
  IndexerThreeDnsResolutionData,
  IndexerThreeDnsResolutionResponse,

  // Recalculate types
  IndexerRecalculateData,
  IndexerRecalculateResponse,

  // Authenticate types
  IndexerAuthenticateData,
  IndexerAuthenticateResponse,

  // Verify types
  IndexerVerifyData,
  IndexerVerifyResponse,

  // KYC API response wrappers
  IndexerKYCInitiateResponse,
  IndexerKYCStatusResponse,
  IndexerKYCWebhookData,
  IndexerKYCWebhookResponse,

  // Solana API response types
  IndexerSolanaWebhookData,
  IndexerSolanaWebhookResponse,
  IndexerSolanaSetupResult,
  IndexerSolanaSetupData,
  IndexerSolanaSetupResponse,
  IndexerSolanaIndexerStatus,
  IndexerSolanaStatusData,
  IndexerSolanaStatusResponse,
  IndexerSolanaTestTransactionData,
  IndexerSolanaTestTransactionResponse,

  // OAuth response types
  IndexerOAuthChallengeData,
  IndexerOAuthChallengeResponse,
  IndexerOAuthVerifyData,
  IndexerOAuthVerifyResponse,
  IndexerOAuthAuthorizeData,
  IndexerOAuthAuthorizeResponse,
  IndexerOAuthTokenData,
  IndexerOAuthTokenResponse,
  IndexerOAuthUserInfoData,
  IndexerOAuthUserInfoResponse,
  IndexerOAuthClientInfoData,
  IndexerOAuthClientInfoResponse,

  // Error response types
  IndexerErrorResponse,

  // Generic response types
  IndexerApiResponse,
} from './indexer-responses.js';

// Export type guards
export {
  isAddressValidationResponse,
  isEmailAccountsResponse,
  isRewardsResponse,
  isDelegatedToResponse,
  isDelegatedFromResponse,
  isNonceResponse,
  isEntitlementResponse,
  isSignInMessageResponse,
  isPointsResponse,
  isLeaderboardResponse,
  isSiteStatsResponse,
  isReferralCodeResponse,
  isReferralStatsResponse,
  isAuthenticationStatusResponse,
  isBlockStatusResponse,
  isNameServiceResponse,
  isNameResolutionResponse,
  isTemplateResponse,
  isTemplateListResponse,
  isTemplateDeleteResponse,
  isWebhookResponse,
  isWebhookListResponse,
  isWebhookDeleteResponse,
  isIndexerErrorResponse,
  isIndexerSuccessResponse,
} from './indexer-guards.js';

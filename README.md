# @sudobility/mail_box_types

TypeScript type definitions, enums, type guards, and helper functions for the 0xMail protocol. Covers the Indexer API, WildDuck mail server (REST and WebSocket), KYC/Sumsub verification, and multi-chain mailbox smart contract interactions (EVM and Solana).

## Installation

This package is published to **GitHub Packages** under the `@sudobility` scope, not the public npm registry. Consumers need an `.npmrc` pointing the scope at GitHub Packages plus a token with `read:packages`:

```
@sudobility:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_READ_TOKEN}
```

```bash
bun add @sudobility/mail_box_types
```

## Usage

```typescript
import {
  // Indexer types and guards
  isEmailAccountsResponse,
  isRewardsResponse,
  type IndexerEmailAccountsResponse,

  // WildDuck types
  MailboxSpecialUse,
  EmailFolderUtils,
  createPreAuthRequest,
  isWildduckAuthResponse,
  type WildduckMessageDetail,

  // WildDuck WebSocket types
  createWildduckSubscribeRequest,
  isWildduckDataMessage,
  type WildduckWebSocketChannel,

  // KYC types
  KYCVerificationLevel,
  KYCApplicationStatus,
  type InitiateKYCResponse,

  // Mailer / contract types
  ConfirmationStatus,
  ClaimType,
  isEVMResponse,
  isSolanaResponse,
  type MessageSendResponse,
} from '@sudobility/mail_box_types';
```

## API

### Indexer (`types/indexer/`)
- ~50 response interfaces (accounts, rewards, points, delegation, name service, auth, referrals, templates, webhooks)
- 25 runtime type guards (`isEmailAccountsResponse`, `isRewardsResponse`, etc.)

### WildDuck REST (`types/wildduck/`)
- ~80 interfaces for users, mailboxes, messages, addresses, filters, settings, DKIM, webhooks
- `MailboxSpecialUse` enum, `EmailFolderUtils` helper, factory functions

### WildDuck WebSocket (`types/wildduck/`)
- ~50 interfaces for 5 real-time channels (mailboxes, settings, filters, autoreply, messages)
- Type guards and factory functions for subscribe/unsubscribe/fetch requests

### KYC (`types/kyc/`)
- ~25 interfaces + 6 enums for Sumsub three-tier identity verification

### Mailer (`types/mailer/`)
- ~25 interfaces + 3 enums for multi-chain (EVM + Solana) smart contract responses
- Type guards: `isEVMResponse`, `isSolanaResponse`, `isMailboxErrorResponse`, etc.

## Development

```bash
bun install
bun run verify          # typecheck + lint + test:unit + build
bun run test:unit       # Vitest (run once)
bun run test:watch      # Vitest watch mode
bun run build           # ESM build (tsc -p tsconfig.esm.json) -> dist/
bun run dev             # tsc --watch
```

## Related Packages

- `@sudobility/types` -- shared utility types (peer dependency)
- `@sudobility/contracts` -- smart contract clients consuming these types
- `@sudobility/indexer_client` -- indexer API client consuming these types
- `@sudobility/wildduck_client` -- WildDuck client consuming these types

## License

BUSL-1.1

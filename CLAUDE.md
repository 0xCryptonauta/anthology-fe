# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Anthology is a React-based web application for managing collective memory on the blockchain (Arbitrum). Users can deploy Anthology contracts, add memoirs (content entries), and share them. Built with Vite + React 18 + TypeScript.

## Commands

```bash
bun run dev          # Start development server (Vite)
bun run build        # Production build
bun run preview      # Preview production build
bun run tsc          # Type check
bun run lint         # ESLint
```

## Architecture

### Tech Stack
- **Build**: Vite 6, TypeScript 5
- **UI**: React 18, Tailwind CSS 4, Bootstrap 5, react-bootstrap
- **State**: Redux Toolkit with redux-persist (localStorage)
- **Routing**: React Router DOM 7
- **Web3**: wagmi 2, viem, WalletConnect
- **Data Fetching**: TanStack Query (React Query 5)
- **PWA**: vite-plugin-pwa with workbox

### Path Aliases (tsconfig.json)
- `@src/*` → src/*
- `@components/*` → src/components/*
- `@store/*` → src/store/*
- `@hooks/*` → src/hooks/*
- `@utils/*` → src/utils/*
- `@views/*` → src/views/*
- `@abi/*` → src/abi/*
- `@types/*` → src/types/*
- `@contract-functions/*` → src/contract-functions/*

### Core Structure

**State Management (src/store/)**
- `redux.ts` - Store configuration with redux-persist
- Slices: `factorySlice`, `userSlice`, `anthologySlice`, `localAnthologySlice`, `dappSlice`
- Thunks in `store/utils/thunks.ts` for async operations

**Smart Contract Interaction (src/contract-functions/)**
- `factoryFunctions.ts` - Factory contract reads/writes with localStorage caching
- `anthologyFunctions.ts` - Anthology contract operations
- `fetchContractInfo.ts` - Contract metadata fetching
- Uses retryWithBackoff for failed RPC calls

**Components (src/components/)**
- `Factory/` - Contract deployment, user contract discovery, whitelist management
- `Anthology/` - Memoir management, skin rendering, owner controls
- `Layout/` - Header, Footer, SidePanel, WalletConnector, shared UI

**Views (src/views/)**
- `RootView.tsx` - Main layout wrapper
- `IndexView.tsx` - Landing page
- `factory/` - FactoryStateView, UserView, LocalUserView, DiscoverView
- `anthology/` - AnthologyView, LocalAnthologyView, AnthologyShareView

### Key Patterns

**Caching**: Factory reads use localStorage with `CACHE_DURATION_MS` TTL. Keys generated via `getCacheFactoryKey()`.

**Web3 Config**: wagmi config created via `createWagmiConfig()` in `src/wagmiConfig.ts`, wrapped in `ContextWagmiProvider` for runtime RPC customization.

**Memoir Skins**: Different content types rendered via skin system (`memoirSkins/`): media, json, text, playlist, list.

**Local Anthology**: Supports offline/local contract simulation via `localAnthologySlice` and `LocalUserView`.

### Environment Variables (.env)
- `VITE_WC_PROJECT_ID` - WalletConnect project ID
- `VITE_FACTORY_CONTRACT` - Factory contract address
- `VITE_FACTORY_RPC` - Custom Arbitrum RPC endpoint
- `VITE_ENV` - Environment mode

### Release Process
Uses `standard-version` for conventional commits-based versioning. `bun run release` only allowed on main branch.

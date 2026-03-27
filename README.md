# PocketMath

A Greek tax calculator for employees, self-employed, and mplokaki workers.

## Features

- Calculate income tax based on employment type
- Support for EFKA contributions and tax credits
- Multi-language support (Greek/English)
- Toggle between monthly and annual calculations

## Setup

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173 in your browser.

## Project Structure

- `src/components/` - React UI components
- `src/lib/tax/` - Tax calculation logic and tests
- `src/routes/` - Page routes for different calculator types
- `src/i18n/` - Translations

## Testing

```bash
pnpm test
```

## Build

```bash
pnpm build
```

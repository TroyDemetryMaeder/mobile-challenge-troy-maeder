# Weather Challenge — Starter

This is the starter repo for the mobile developer technical challenge. The actual challenge is described in [`CANDIDATE_INSTRUCTIONS.md`](./CANDIDATE_INSTRUCTIONS.md) — please read that first.

## Prerequisites

- Node.js 18+ (LTS recommended)
- Yarn or npm
- React Native development environment set up for iOS and/or Android.
  See the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment) if you don't have it ready.
- For OpenWeatherMap: a free API key from https://openweathermap.org/api

## Setup

```sh
# 1. Install dependencies
npm install
# or: yarn install

# 2. (iOS only) Install CocoaPods
cd ios && pod install && cd ..

# 3. Copy the env example and add your OpenWeatherMap key
cp .env.example .env
# then edit .env
```

## Run

```sh
# iOS
npm run ios

# Android
npm run android

# Metro bundler only (if running from Xcode / Android Studio)
npm start
```

## Test

```sh
# Run all tests
npm test

# Watch mode
npm run test:watch
```

## Lint and format

```sh
npm run lint
npm run format
```

## Project layout

```
src/
├── components/      # UI components (stubs provided)
├── screens/         # Screen-level components
├── services/        # Weather service implementations + interface
├── validation/      # Input validation
├── hooks/           # Custom hooks (empty — use if you want)
├── theme/           # Colors and theming
└── utils/           # Anything else
```

See `CANDIDATE_INSTRUCTIONS.md` for the actual challenge.

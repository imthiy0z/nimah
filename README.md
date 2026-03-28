# Nimah

Mobile app for **Nimah** — save surplus food, pay less, waste less. Built with **Expo** and **React Native** (TypeScript).

## What’s in the app

- **Customer:** Home, Discover, cart, orders, rewards, profile, pickup location, English / Arabic (`i18n`).
- **Store owner:** Partner portal — dashboard, incoming orders, listings (add / edit / demo scan / bulk stock), messages, store menu.
- **UI:** Orange brand theme, maps, blur / gradients, OMR display.

## Prerequisites

- Node.js 18+ recommended  
- npm (or yarn / pnpm)  
- [Expo Go](https://expo.dev/go) on a device for quick testing (optional)

## Setup

```bash
npm install
npm start
```

Then press `i` (iOS simulator), `a` (Android emulator), or `w` (web), or scan the QR code with Expo Go.

Clear cache if Metro misbehaves:

```bash
npx expo start --clear
```

## Project layout

```
├── App.tsx                 # Root navigation / role switching
├── index.ts                # Entry (providers)
├── assets/                 # Images, icons
├── components/             # Shared UI (tabs, carousel, modals, …)
├── constants/              # Theme, mock partners, discover collections
├── contexts/               # Language, pickup location
├── i18n/                   # en / ar strings
├── screens/                # Customer screens
├── screens/storeOwner/     # Partner portal
└── utils/                  # e.g. safe AsyncStorage helpers
```

## Brand colors

- **Primary:** `#F97316` (orange)  
- **Primary dark:** `#EA580C`  
- **Secondary / text:** `#2A3F4E`  
- **Background:** `#F7F7F7`

## Tech stack

Expo · React Native · TypeScript · Expo Image / Blur / Linear Gradient · react-native-maps · Reanimated · AsyncStorage

## License

Private — Nimah.

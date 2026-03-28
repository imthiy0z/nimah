# Badr Al Samaa Hospital Mobile App

A beautiful, modern mobile application for Badr Al Samaa Group of Hospitals & Medical Centres built with Expo and React Native.

## Features

- ✨ Smooth animations with React Native Reanimated
- 🎨 Glassmorphism (liquid glass) effects
- 🎯 Modern UI with Badr Al Samaa brand colors
- 📱 Cross-platform (iOS, Android, Web)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Adding Your Onboarding Image

1. Place your image in the `assets/` folder
2. Name it `onboarding-image.png` (or update the import in `screens/OnboardingScreen.tsx`)
3. Uncomment the Image component in `OnboardingScreen.tsx` (around line 80)
4. Comment out or remove the placeholder gradient section

Example:
```tsx
<Image
  source={require('../assets/onboarding-image.png')}
  style={styles.image}
  contentFit="cover"
  transition={300}
/>
```

## Project Structure

```
├── assets/              # Images, fonts, and other static assets
├── constants/           # Theme, colors, and configuration
│   ├── colors.ts       # Brand color palette
│   └── theme.ts        # Theme configuration
├── screens/             # Screen components
│   └── OnboardingScreen.tsx
├── App.tsx             # Main app entry point
└── babel.config.js     # Babel configuration
```

## Brand Colors

- **Primary**: #DA5665 (Badr Red/Pink)
- **Secondary**: #2A3F4E (Dark Slate Blue)
- **Background**: #F7F7F7 (Off-White/Grey)
- **WhatsApp**: #25D366 (WhatsApp Green)

## Technologies Used

- **Expo** - React Native framework
- **React Native Reanimated** - Smooth animations
- **Expo Blur** - Glassmorphism effects
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Image** - Optimized image component
- **TypeScript** - Type safety

## Next Steps

- [ ] Add navigation (React Navigation)
- [ ] Implement authentication screens
- [ ] Create main app screens (Home, Appointments, etc.)
- [ ] Add custom fonts (Source Sans Pro)
- [ ] Integrate API endpoints

## License

Private - Badr Al Samaa Hospital



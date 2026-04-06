# Electron + React + TypeScript Template

Modern, production-ready Electron application template featuring glassmorphic design, comprehensive component library, and industry-standard patterns.

##  Features

### Modern Stack
- **React 18** - Latest React with hooks and concurrent features
- **TypeScript** - Full type safety across the entire application
- **Electron** - Cross-platform desktop application framework
- **Vite** - Lightning-fast build tooling and HMR
- **Tailwind CSS** - Utility-first styling with custom design system
- **Ant Design** - Enterprise-grade React UI components

### Design System
- **Glassmorphic UI** - Ultra-translucent glass effects with minimal blur
- **Dark/Light/System Themes** - Complete theme management with auto-detection
- **Responsive Layouts** - Mobile-first approach with breakpoints
- **Custom Components** - GlassCard, GlassButton, and more
- **Professional Aesthetics** - Clean, modern appearance suitable for any domain

### Production Patterns
- **IndexedDB Storage** - Type-safe database wrapper for local persistence
- **Component Architecture** - Reusable, composable UI components
- **State Management** - React Context for global state
- **Multi-step Workflows** - Complex user flows with progress tracking
- **Audio Recording/Visualization** - Recording and waveform display components
- **Modal Systems** - Confirmation dialogs, forms, and overlays

##  Design System

### Color Scheme
- **Primary Purple**: `#744AA1` - Main brand color
- **Secondary Blue**: `#0672E5` - Accent color
- **Tertiary Purple**: `#8C7DD1` - Interactive elements
- **Periwinkle**: `#ACACE6` - Borders and highlights

### Theme Support
The application includes complete theme management:
- **Dark Theme** (default) - Professional dark mode with high contrast
- **Light Theme** - Clean light mode for daytime use
- **System Theme** - Automatically follows OS preference

### Visual Philosophy
- Ultra-translucent glass backgrounds (3% opacity)
- Minimal blur effects for performance
- High contrast ratios for accessibility
- Smooth transitions and hover effects

##  Project Structure

```
vite-electron-app-template/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   ├── menu.ts        # Application menu
│   │   └── menuHandlers.ts
│   ├── preload/           # Preload scripts for security
│   │   └── index.ts
│   ├── renderer/          # React application
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── GlassButton.tsx
│   │   │   │   ├── AudioWaveform.tsx
│   │   │   │   └── ...
│   │   │   ├── pages/       # Page components
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── QuickScanPage.tsx
│   │   │   │   └── ...
│   │   │   ├── contexts/    # React Context providers
│   │   │   │   └── ThemeContext.tsx
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   │   ├── useAudioRecording.ts
│   │   │   │   └── ...
│   │   │   ├── types/       # TypeScript interfaces
│   │   │   ├── enums/       # TypeScript enums
│   │   │   ├── utils/       # Utility functions
│   │   │   │   ├── storage.ts    # IndexedDB wrapper
│   │   │   │   └── mockData.ts
│   │   │   └── styles/      # Global styles
│   │   │       └── theme.css
│   │   └── index.html
│   └── shared/            # Code shared between main and renderer
├── build/                 # Build assets (icons, etc.)
├── resources/             # Application resources
└── package.json
```

##  Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Installation

```bash
# Clone or download this template
git clone <your-repo-url>
cd vite-electron-app-template

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Development with hot reload
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Code formatting
npm run format

# Build for production
npm run build

# Build and run unpacked
npm run build:unpack

# Platform-specific builds
npm run build:win     # Windows
npm run build:mac     # macOS
npm run build:linux   # Linux
```

##  Customization Guide

### 1. Update Package Information

**File: `package.json`**
```json
{
  "name": "your-app-name",
  "description": "Your app description",
  "author": "Your Name <your.email@example.com>",
  "version": "1.0.0"
}
```

### 2. Replace Logo

- Replace `src/renderer/src/assets/app_logo.svg` with your logo
- Update the import in `src/renderer/src/pages/HomePage.tsx`

### 3. Customize Colors

**File: `src/renderer/src/styles/theme.css`**

Update CSS custom properties:
```css
:root {
  --primary-purple: #744AA1;   /* Your primary color */
  --secondary-blue: #0672E5;   /* Your secondary color */
  /* ... other variables ... */
}
```

### 4. Modify Pages

The template includes example pages demonstrating different patterns:
- **HomePage** - Landing page with navigation cards
- **QuickScanPage** - Multi-step workflow example
- **RecordingsList** - Data management with filters
- **PatientList** - CRUD operations example
- **Settings** - Configuration management

Customize or replace these pages based on your needs.

### 5. Update Type Definitions

See `src/renderer/src/types/README.md` and `src/renderer/src/enums/README.md` for guidance on replacing the example types with your domain-specific types.

### 6. Configure Menu

**File: `src/main/menu.ts`**

Update application menu items, keyboard shortcuts, and menu actions to match your application's functionality.

##  Key Components

### GlassCard
Translucent container with glassmorphic effect:
```tsx
<GlassCard padding="md" className="custom-class">
  <p>Content here</p>
</GlassCard>
```

### GlassButton
Interactive button with glass styling:
```tsx
<GlassButton
  variant="primary"
  size="md"
  icon={<IconComponent />}
  onClick={handleClick}
>
  Button Text
</GlassButton>
```

### Theme Management
```tsx
import { useTheme } from '@renderer/contexts/ThemeContext';

function MyComponent() {
  const { themeMode, isDarkMode, setThemeMode } = useTheme();

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      {/* content */}
    </div>
  );
}
```

### Storage (IndexedDB)
```tsx
import { savePatient, getPatients } from '@renderer/utils/storage';

// Save data
await savePatient({ name: 'John Doe', ... });

// Retrieve data
const patients = await getPatients();
```

##  Tech Stack Details

### Core Dependencies
- `react` ^18.3.1 - UI framework
- `electron` ^31.0.2 - Desktop framework
- `typescript` ^5.5.2 - Type safety
- `vite` ^5.3.1 - Build tool
- `antd` ^5.19.3 - UI component library
- `tailwindcss` ^3.4.7 - Utility CSS

### Development Tools
- `electron-vite` - Electron + Vite integration
- `electron-builder` - Application packaging
- `eslint` - Code linting
- `prettier` - Code formatting

##  Use Cases

This template is perfect for:
- **Business Applications** - CRM, project management, internal tools
- **Content Creation Tools** - Editors, design tools, media processors
- **Data Management Apps** - Database frontends, admin panels
- **Scientific Applications** - Data analysis, visualization
- **Educational Software** - Learning platforms, training tools

##  Architecture Highlights

### Component Patterns
- Compound components for complex UI
- Render props for flexibility
- Custom hooks for logic reuse
- Context for global state

### Performance
- Code splitting with React.lazy
- Memoization with React.memo
- Optimized re-renders
- Efficient IndexedDB queries

### Security
- Context isolation enabled
- Preload scripts for IPC
- Content Security Policy
- No Node.js in renderer (by default)

##  Contributing

This is a template repository. Fork it, customize it, and make it your own!

##  License

This template is provided as-is for any use. Customize and distribute freely.

##  Support

- **Documentation**: See `CLAUDE.md` for detailed development guidance
- **Customization**: See `TEMPLATE_USAGE.md` for step-by-step customization
- **Issues**: Check the original repository for common issues and solutions

---

**Built with**  **using modern web technologies**

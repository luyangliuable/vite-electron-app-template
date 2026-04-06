# Template Customization Guide

This guide walks you through converting this template into your own application, step by step.

##  Quick Start Checklist

Use this checklist to track your customization progress:

- [ ] Update package.json metadata
- [ ] Replace logo and branding
- [ ] Customize color scheme
- [ ] Update application name in menus
- [ ] Replace type definitions with your domain types
- [ ] Customize pages for your use case
- [ ] Update IndexedDB schema for your data
- [ ] Test build process
- [ ] Update documentation

##  Detailed Customization Steps

### Step 1: Project Identity

**File: `package.json`**

Update these fields to match your application:

```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "description": "Your application description",
  "author": "Your Name <your.email@example.com>",
  "homepage": "https://your-website.com"
}
```

### Step 2: Branding & Assets

#### Replace Logo

1. Create or obtain your application logo
2. Replace `src/renderer/src/assets/app_logo.svg` with your logo file
3. Update the logo import in `src/renderer/src/pages/HomePage.tsx` if you use a different file format:

```tsx
import image from "../assets/your-logo.png"; // or .svg, .jpg, etc.
```

#### Update App Icons

Replace icons in the `build/` directory:
- `build/icon.icns` - macOS icon
- `build/icon.ico` - Windows icon
- `build/icon.png` - Linux icon

### Step 3: Color Scheme

**File: `src/renderer/src/styles/theme.css`**

Update CSS custom properties to match your brand:

```css
:root {
  /* Primary Colors - Update these */
  --primary-purple: #744AA1;      /* Your primary color */
  --secondary-blue: #0672E5;      /* Your accent color */
  --tertiary-purple: #8C7DD1;     /* Interactive elements */
  --periwinkle: #ACACE6;          /* Borders/highlights */

  /* Keep these as-is or adjust for your needs */
  --bg-primary: 0 0 0;
  --bg-secondary: 255 255 255;
  --glass-bg: rgba(255, 255, 255, 0.1);
  /* ... */
}
```

### Step 4: Application Menu

**File: `src/main/menu.ts`**

Customize menu items for your application:

```typescript
// Update menu labels
{
  label: "Your Menu Item",
  accelerator: "CmdOrCtrl+N",
  click: () => {
    // Your action here
  }
}

// Update About dialog
function showAboutDialog(mainWindow: BrowserWindow): void {
  const name = "Your App Name";
  dialog.showMessageBox(mainWindow, {
    message: `${name} ${version}`,
    detail: `Your application description here`,
  });
}
```

### Step 5: Type Definitions

The template includes example types from the original medical application. You have three options:

#### Option A: Keep as Examples

Leave the types as-is if you want to reference them while building your own features.

#### Option B: Delete and Start Fresh

```bash
# Remove example types
rm -rf src/renderer/src/types/*
rm -rf src/renderer/src/enums/*

# Create your own
# e.g., src/renderer/src/types/User.ts
```

#### Option C: Modify for Your Domain

Update existing types to match your domain:

**Example: Patient → User**

```typescript
// Before (src/renderer/src/types/Patient.ts)
interface Patient {
  id: number;
  name: string;
  dob: string;
  patient_uid: string;
}

// After (rename to User.ts)
interface User {
  id: number;
  name: string;
  dateJoined: string;
  userId: string;
}
```

### Step 6: Database Schema

**File: `src/renderer/src/utils/storage.ts`**

Update the IndexedDB schema for your data:

```typescript
// 1. Update database name (already done in template)
const DB_NAME = "YourAppDB";

// 2. Update object stores
const STORES = {
  USERS: "users",              // Your entities
  PROJECTS: "projects",        // Your data
  SETTINGS: "settings",        // Keep this
} as const;

// 3. Update store creation in onupgradeneeded
request.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;

  // Create your stores
  if (!db.objectStoreNames.contains(STORES.USERS)) {
    db.createObjectStore(STORES.USERS, {
      keyPath: "id",
      autoIncrement: true,
    });
  }
  // ... add more stores as needed
};

// 4. Add CRUD methods for your data types
async saveUser(user: Omit<User, "id">): Promise<User> {
  // Implementation
}
```

### Step 7: Customize Pages

Update pages to match your application's functionality:

#### HomePage (`src/renderer/src/pages/HomePage.tsx`)

Update navigation cards:

```tsx
const buttons = [
  {
    text: "Your Feature 1",
    path: "/feature-1",
    icon: <YourIcon />,
    description: "Description of your feature",
  },
  {
    text: "Your Feature 2",
    path: "/feature-2",
    icon: <AnotherIcon />,
    description: "Another feature description",
  },
];
```

Update footer text:

```tsx
<p>
  Your application tagline or description here.
  Explain what makes your app special.
</p>
```

#### Other Pages

Decide which example pages to keep, modify, or remove:

- **QuickScanPage** - Multi-step workflow example
  - Keep if you need multi-step processes
  - Remove if not applicable

- **RecordingsList** - Data listing with filters
  - Adapt for your data type
  - Update filters and columns

- **PatientList** - CRUD operations example
  - Rename and adapt for your entity type
  - Update form fields

- **Settings** - Configuration page
  - Keep and customize settings
  - Add your app-specific settings

### Step 8: Routing

**File: `src/renderer/src/App.tsx`**

Update routes to match your pages:

```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/your-feature" element={<YourFeature />} />
  <Route path="/settings" element={<Settings />} />
  {/* Add your routes */}
</Routes>
```

### Step 9: Mock Data

**File: `src/renderer/src/utils/mockData.ts`**

Update or remove mock data seeding:

```typescript
// Update sample data for your domain
const createSampleUser = () => {
  return {
    name: 'Sample User',
    email: 'sample@example.com',
    userId: 'DEMO-001'
  };
};

// Or remove mock data completely if not needed
```

### Step 10: Testing

After customization, verify everything works:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Development mode
npm run dev

# Test the app
# - Navigate through all pages
# - Test data operations
# - Try theme switching
# - Check settings persistence

# Production build
npm run build
npm run build:unpack
```

##  Common Use Cases

### CRM Application

1. Replace Patient types with Customer/Contact types
2. Update QuickScanPage → Lead Capture workflow
3. PatientList → Contact Management
4. Add email/communication features

### Project Management Tool

1. Replace Patient with Project type
2. RecordingsList → Task List
3. QuickScanPage → Project Creation workflow
4. Add team collaboration features

### Media Player

1. Replace Patient with Playlist type
2. RecordingsList → Media Library
3. QuickScanPage → Media Import workflow
4. Add playback controls

### Task Manager

1. Replace Patient with User/Team type
2. RecordingsList → Task List
3. QuickScanPage → Task Creation
4. Add priority/category filters

##  What to Keep vs Replace

###  Keep (Production-Ready)

- Component architecture (GlassCard, GlassButton, etc.)
- Theme system (ThemeContext)
- Storage wrapper (IndexedDB interface)
- Build configuration
- ESLint/Prettier config
- Tailwind setup

###  Customize

- Page content and layouts
- Navigation structure
- Data models (types/enums)
- Color scheme
- Application menu
- Form fields

###  Remove/Replace

- Medical terminology
- Example types (if not applicable)
- Mock data (after development)
- Example pages (if not needed)

##  Deployment Checklist

Before deploying your application:

- [ ] All "template" references removed
- [ ] Application name updated everywhere
- [ ] Logo and branding updated
- [ ] Type errors resolved
- [ ] Build succeeds without errors
- [ ] Application tested on target platforms
- [ ] Documentation updated
- [ ] Version number set correctly
- [ ] Code signing configured (if needed)
- [ ] Update mechanism configured (optional)

##  Tips

### Performance

- Keep glassmorphic effects minimal (already optimized in template)
- Use React.memo for expensive components
- Implement virtualization for long lists
- Lazy load routes with React.lazy

### Maintainability

- Follow the existing file structure
- Keep components small and focused
- Write TypeScript interfaces for all data
- Document complex logic

### User Experience

- Maintain consistent spacing and sizing
- Use the theme system for colors
- Provide loading states
- Show error messages clearly
- Add keyboard shortcuts

##  Additional Resources

- **React Documentation**: https://react.dev
- **Electron Documentation**: https://electronjs.org
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Ant Design**: https://ant.design

##  Troubleshooting

### Build Errors

**"Cannot find module"**
- Run `npm install` again
- Check import paths use correct aliases

**Type errors**
- Run `npm run typecheck` to see all errors
- Ensure all new files have proper types

### Runtime Errors

**"Database not found"**
- Check storage.ts has correct DB_NAME
- Verify IndexedDB initialization

**Theme not applying**
- Ensure ThemeContext is wrapping your app
- Check CSS variable names match

**Components not rendering**
- Verify imports are correct
- Check React Router configuration

##  You're Ready!

Once you've completed these steps, you'll have a fully customized Electron application with production-ready patterns and a beautiful glassmorphic design.

Happy coding! 

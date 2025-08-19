# GL!TCH HUNTER - Frontend/Backend Integration Contracts

## API Contracts

### Authentication Endpoints
- **POST /api/auth/login**
  - Input: `{ username: string, password: string }`
  - Output: `{ success: boolean, token: string, user: { id: number, username: string } }`
  - Current: Mock response in `App.js:handleLogin()`

- **POST /api/auth/guest**
  - Input: `{}`
  - Output: `{ success: boolean, guestId: string }`
  - Current: Mock response in `App.js:handleGuestPlay()`

### User Preferences
- **GET /api/user/:id/preferences**
  - Output: `{ volume: number, sfx: boolean, difficulty: string }`
  - Current: Using localStorage in `App.js:useEffect()`

- **POST /api/user/:id/preferences**
  - Input: `{ volume?: number, sfx?: boolean, difficulty?: string }`
  - Output: `{ success: boolean }`
  - Current: Mock call in `SettingsModal.jsx:handleSave()`

### Game Management
- **POST /api/game/start**
  - Input: `{ userId: string, difficulty: string }`
  - Output: `{ success: boolean, gameId: string, config: object }`
  - Current: Mock call in `App.js:startGame()`

- **GET /api/game/config**
  - Output: `{ levels: array, difficulty_settings: object, scoring: object }`
  - Current: Not implemented yet (for future game configuration)

## Mock Data Currently Used

### 1. User Authentication
**Location**: `/app/frontend/src/App.js`
```javascript
// Mock login response
const mockResponse = {
  success: true,
  token: 'mock-jwt-token',
  user: { id: 1, username }
};
```

### 2. Guest Session
**Location**: `/app/frontend/src/App.js`
```javascript
// Mock guest response
const mockResponse = {
  success: true,
  guestId: 'guest-' + Date.now()
};
```

### 3. User Preferences
**Location**: `/app/frontend/src/App.js`
```javascript
// Default preferences structure
preferences: {
  volume: 50,
  sfx: true,
  difficulty: 'medium'
}
```

### 4. Demo Credentials
**Location**: `/app/frontend/src/components/LoginModal.jsx`
```javascript
// Demo credentials shown in UI
Username: 'demo_hunter'
Password: 'glitch123'
```

## Frontend to Backend Integration Plan

### Phase 1: Replace Mock Authentication
1. Update `App.js:handleLogin()` to use real API endpoint
2. Add JWT token storage and validation
3. Add error handling for network failures
4. Update login form validation

### Phase 2: User Preferences Integration
1. Replace localStorage with backend API calls
2. Add user preference sync on login
3. Handle offline/online preference conflicts
4. Add preference validation

### Phase 3: Game Session Management
1. Implement real game start endpoint
2. Add game state persistence
3. Add session management
4. Add game configuration loading

### Phase 4: Audio System Backend Integration
1. Add user audio preference storage
2. Sync audio settings across devices
3. Add audio file management (if needed)

## Frontend Components Structure

### Core Components
- `App.js` - Main app state and routing
- `LandingPage.jsx` - Initial loading screen with glitch effects
- `Dashboard.jsx` - Main menu with all game options
- `GlitchButton.jsx` - Reusable styled button component

### Modal Components
- `SettingsModal.jsx` - User preferences management
- `InstructionsModal.jsx` - Game instructions display
- `LoginModal.jsx` - User authentication form

### Utility Classes
- `AudioManager.js` - Audio system management
- `glitch.css` - All cyberpunk styling and animations

## Current Features Working (Frontend Only)
- ✅ Landing page with glitch animations
- ✅ Smooth transitions between pages
- ✅ Settings modal with volume, SFX, difficulty controls
- ✅ Login modal with form validation
- ✅ Instructions modal with game documentation
- ✅ Audio system structure (needs real audio files)
- ✅ Responsive design for desktop and mobile
- ✅ LocalStorage persistence for preferences
- ✅ Cyberpunk theme with neon colors and glitch effects

## Integration Points Ready for Backend
- ✅ All fetch calls structured with try/catch
- ✅ Error handling placeholders in place
- ✅ Mock responses clearly marked for replacement
- ✅ State management ready for real data
- ✅ Authentication flow prepared for JWT tokens
- ✅ User preference sync architecture in place
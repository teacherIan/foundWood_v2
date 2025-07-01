# Found Wood R3F Project

A React Three Fiber project with Tailwind CSS, optimized for LLM-assisted development.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── 3d/                 # Three.js components
│   │   ├── Scene.jsx       # Main 3D scene
│   │   ├── models/         # 3D models and mesh components
│   │   └── effects/        # Post-processing effects
│   └── ui/                 # 2D UI components
│       ├── UI.jsx          # Main UI overlay
│       ├── panels/         # UI panels and modals
│       └── controls/       # Interactive controls
├── hooks/                  # Custom React hooks
│   ├── useAnimations.js    # Animation utilities
│   └── use3D.js           # 3D-specific hooks
├── stores/                 # State management (Zustand)
│   └── sceneStore.js      # Scene state
├── utils/                  # Utility functions
│   ├── 3d-helpers.js      # Three.js utilities
│   └── math.js            # Math utilities
└── assets/                # Static assets
    ├── models/            # 3D model files
    ├── textures/          # Image textures
    └── audio/             # Sound files
```

## 🎨 Design System

### Tailwind Classes for 3D UIs

- `.scene-container` - Full screen 3D canvas container
- `.ui-overlay` - Absolute positioned UI overlay
- `.ui-interactive` - Enable pointer events for UI elements
- `.glass-panel` - Glassmorphism panels for UI
- `.btn-primary` - Primary button styling

### Color Palette

- Background: `bg-gray-900` (dark theme optimized for 3D)
- Primary: `bg-blue-600`
- Glass panels: `bg-white/10` with `backdrop-blur-md`

## 🚀 Development Tips

### For LLMs

1. **File Naming**: Use descriptive, kebab-case names
2. **Component Structure**: Keep 3D and UI components separate
3. **State Management**: Use Zustand for predictable state
4. **Styling**: Prefer Tailwind utilities over custom CSS
5. **Hooks**: Create reusable hooks for common 3D patterns

### Common Patterns

```jsx
// 3D Component with animation
function AnimatedBox() {
  const meshRef = useRotation(1);
  const { objectScale } = useSceneStore();

  return (
    <mesh ref={meshRef} scale={objectScale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// UI Component with Tailwind
function ControlPanel() {
  return (
    <div className="glass-panel p-4 space-y-4">
      <h3 className="text-lg font-semibold">Controls</h3>
      <button className="btn-primary w-full">Action</button>
    </div>
  );
}
```

## 📦 Dependencies

### Core

- `@react-three/fiber` - React Three.js renderer
- `@react-three/drei` - Useful helpers and components
- `three` - Three.js 3D library

### UI & Styling

- `tailwindcss` - Utility-first CSS framework
- `zustand` - Lightweight state management

### Development

- `vite` - Fast build tool
- React 19 - Latest React features

## 🎯 LLM Development Benefits

### Why This Structure Works Well with LLMs:

1. **Clear Separation**: 3D logic separate from UI logic
2. **Predictable Patterns**: Consistent naming and structure
3. **Tailwind Integration**: No context switching between files
4. **Type Safety**: JSX provides clear component interfaces
5. **Modular Design**: Easy to understand and modify individual pieces

### Quick Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🎨 Extending the Project

### Adding New 3D Objects

1. Create component in `src/components/3d/`
2. Import and use in `Scene.jsx`
3. Add controls in UI if needed

### Adding UI Elements

1. Create component in `src/components/ui/`
2. Use Tailwind classes for styling
3. Add to main `UI.jsx` overlay

### Adding State

1. Extend `sceneStore.js` or create new store
2. Use throughout components with `useSceneStore()`

This structure is optimized for rapid development with LLM assistance while maintaining clean, scalable code.

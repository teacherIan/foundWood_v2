import { create } from 'zustand';

export const useSceneStore = create((set) => ({
  // Scene state
  isAnimating: true,
  rotationSpeed: 1,
  objectScale: 1,
  currentScene: 'default',

  // Actions
  toggleAnimation: () => set((state) => ({ isAnimating: !state.isAnimating })),
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
  setObjectScale: (scale) => set({ objectScale: scale }),
  setCurrentScene: (scene) => set({ currentScene: scene }),

  // Reset
  reset: () =>
    set({
      isAnimating: true,
      rotationSpeed: 1,
      objectScale: 1,
      currentScene: 'default',
    }),
}));

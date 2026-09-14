"use client";

import { create } from "zustand";

interface AppState {
  /** Preloader finished — hero intro animations wait for this */
  loaderDone: boolean;
  setLoaderDone: (done: boolean) => void;

  /** Fullscreen menu overlay */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  loaderDone: false,
  setLoaderDone: (done) => set({ loaderDone: done }),

  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
}));

import { create } from "zustand";

// Not persisted on purpose: this reflects the *current session's* connectivity,
// it should re-check the real API again next time the app loads.
export const useApiStatusStore = create((set) => ({
  usingMock: false,
  setUsingMock: (value) => set({ usingMock: value }),
}));

import { create } from "zustand";

interface User {
  email: string;
  name: string;
  // Add other user-related fields here
}

interface UserStoreState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}));

// export default useUserStore;

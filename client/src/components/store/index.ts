import { create } from "zustand";

interface User {
  createdAt: string; // ISO date string
  email: string;
  firstname: string;
  lastname: string;
  organizationName: string;
  organizationURL: string;
  password: string; // Hashed password
  salt: string;
  updatedAt: string; // ISO date string
  __v: number; // Version key, typically used in Mongoose
  _id: string; // MongoDB ObjectId as a string
}

interface UserStoreState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  token: null,
  loading: false,
  setLoading: (loading) => set({ loading }),
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}));

// export default useUserStore;

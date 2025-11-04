import { create } from "zustand";
import { userService } from "../features/users/services/UserService";
import type { User } from "../features/users/types/User.interface";
import type { RegisterUser } from "../features/users/types/RegisterUser.interface";
import type { LoginPayload } from "../features/users/types/LoginPayload.interface";

type UserState = {
  users: User[];
  loading: boolean;
  error: string | null;
  token: string | null;

  // actions
  setToken: (token: string | null) => void;
  clearError: () => void;

  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | void>;
  registerUser: (payload: RegisterUser) => Promise<void>;
  loginUser: (payload: LoginPayload) => Promise<string | void>; 
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  token: null,

  setToken: (token) => set({ token }),

  clearError: () => set({ error: null }),

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().token;
      if (!token) {
        set({ error: "Admin token required to fetch users.", loading: false });
        return;
      }
      const res = await userService.listAll(token);
      set({ users: res, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to fetch users", loading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().token ?? undefined;
      const user = await userService.getById(id, token);
      set({ loading: false });
      return user;
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to fetch user", loading: false });
    }
  },

  registerUser: async (payload) => {
    set({ loading: true, error: null });
    try {
      await userService.register(payload);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to register user", loading: false });
    }
  },

  loginUser: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await userService.login(payload);
      const token = res.token;
      set({ token, loading: false });
      return token;
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to login", loading: false });
    }
  },
}));

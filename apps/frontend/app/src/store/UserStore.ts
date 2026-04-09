import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userService } from "../features/users/services/UserService";
import type { User } from "../features/users/types/User.interface";
import type { RegisterUser } from "../features/users/types/RegisterUser.interface";
import type { LoginPayload } from "../features/users/types/LoginPayload.interface";

type UserState = {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  token: string | null;

  setToken: (token: string | null) => void;
  clearError: () => void;

  setUser: (user: User | null) => void;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | void>;
  registerUser: (payload: RegisterUser) => Promise<void>;
  loginUser: (payload: LoginPayload) => Promise<string | void>;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      loading: false,
      error: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (!token) {
          set({ token: null, user: null });
          try {
            localStorage.removeItem("user-storage");
            localStorage.removeItem("token");
          } catch (e) {
            // noop
          }
        } else {
          try {
            localStorage.setItem("token", token);
          } catch (e) {
            // noop
          }
          set({ token });
        }
      },

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
          const res = await userService.register(payload);
          set({ token: res.token, user: res.user, loading: false });
          try {
            localStorage.setItem("token", res.token);
          } catch (e) { }
        } catch (err: any) {
          set({ error: err?.message ?? "Failed to register user", loading: false });
        }
      },

      loginUser: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await userService.login(payload);
          const token = res.token;
          set({ token, user: res.user, loading: false });
          try {
            localStorage.setItem("token", token);
          } catch (e) { }
          return token;
        } catch (err: any) {
          set({ error: err?.message ?? "Failed to login", loading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null });
        try {
          localStorage.removeItem("user-storage");
          localStorage.removeItem("token")
        } catch (e) { }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      version: 1,
    }
  )
);

import type { LoginPayload } from "../types/LoginPayload.interface";
import type { RegisterUser } from "../types/RegisterUser.interface";
import type { User } from "../types/User.interface";

const API_URL = import.meta.env.VITE_API_URL;

export const userService = {
  register: async (payload: RegisterUser): Promise<{ message: string }> => {
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to register user.");
      return await res.json();
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  login: async (payload: LoginPayload): Promise<{ token: string }> => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to login.");
      return await res.json();
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  listAll: async (token: string): Promise<User[]> => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users.");
      return await res.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getById: async (id: string, token?: string): Promise<User> => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/users/${id}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch user by id.");
      return await res.json();
    } catch (error) {
      console.error("Error fetching user by id:", error);
      throw error;
    }
  },
};

import type { ICreateRoom } from "../types/ICreateRoom";
import type { IUpdateRoom } from "../types/IUpdateRoom";

const API_URL = import.meta.env.VITE_API_URL;

export const roomService = {
  getAllRooms: async () => {
    try {
      const response = await fetch(`${API_URL}/rooms`);
      if (!response.ok) throw new Error("Failed to fetch rooms.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },

  getRoomById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`);
      if (!response.ok) throw new Error("Failed to fetch room by ID.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching room by ID:", error);
      throw error;
    }
  },

  createRoom: async (data: ICreateRoom, token: string) => {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create room.");
      return await response.json();
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  updateRoom: async (id: string, data: IUpdateRoom, token: string) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update room.");
      return await response.json();
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  deleteRoom: async (id: string, token: string) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete room.");
      return true;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },
};
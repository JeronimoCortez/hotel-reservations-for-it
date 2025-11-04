import type { ICreateReservation } from "../types/ICreateReservation";
import type { Reservation } from "../types/Reservation.interface";

const API_URL = import.meta.env.VITE_API_URL;

export const reservationService = {
  listAll: async (token: string): Promise<Reservation[]> => {
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to list reservations.");
      return await res.json();
    } catch (error) {
      console.error("Error listing reservations:", error);
      throw error;
    }
  },

  listByUser: async (userId: string, token?: string): Promise<Reservation[]> => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/reservations/user/${userId}`, { headers });
      if (!res.ok) throw new Error("Failed to list reservations for user.");
      return await res.json();
    } catch (error) {
      console.error("Error listing reservations by user:", error);
      throw error;
    }
  },

  create: async (payload: ICreateReservation, token?: string): Promise<Reservation> => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create reservation.");
      return await res.json();
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },

  confirm: async (reservationId: string, token: string): Promise<Reservation> => {
    try {
      const res = await fetch(`${API_URL}/reservations/confirm/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reservationId }),
      });
      if (!res.ok) throw new Error("Failed to confirm reservation.");
      return await res.json();
    } catch (error) {
      console.error("Error confirming reservation:", error);
      throw error;
    }
  },

  cancel: async (reservationId: string, requesterUserId: string, token?: string): Promise<Reservation | null> => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/reservations/cancel/${reservationId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ reservationId, requesterUserId }),
      });
      if (!res.ok) throw new Error("Failed to cancel reservation.");
      if (res.status === 204) return null;
      return await res.json();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      throw error;
    }
  },
};

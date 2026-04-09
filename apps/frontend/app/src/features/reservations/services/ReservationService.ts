import type { ICreateReservation } from "../types/ICreateReservation";
import type { Reservation } from "../types/Reservation.interface";
import type { ReservationStatus } from "../types/ReservationStatus.enum";

const API_URL = import.meta.env.VITE_API_URL;

function normalizeReservation(input: any): Reservation {
  return {
    id: String(input.id ?? input.reservationId),
    userId: String(input.userId),
    roomId: String(input.roomId),
    startDate: String(input.startDate),
    endDate: String(input.endDate),
    status: (input.status ?? "PENDING") as ReservationStatus,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}

export const reservationService = {
  listAll: async (token: string): Promise<Reservation[]> => {
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to list reservations.");
      const data = await res.json();
      return Array.isArray(data) ? data.map(normalizeReservation) : [];
    } catch (error) {
      console.error("Error listing reservations:", error);
      throw error;
    }
  },

  listByUser: async (userId: string, token: string): Promise<Reservation[]> => {
    try {
      const res = await fetch(`${API_URL}/reservations/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to list reservations for user.");
      const data = await res.json();
      return Array.isArray(data) ? data.map(normalizeReservation) : [];
    } catch (error) {
      console.error("Error listing reservations by user:", error);
      throw error;
    }
  },

  create: async (payload: ICreateReservation, token: string): Promise<Reservation> => {
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create reservation.");
      const data = await res.json();
      return normalizeReservation({
        id: data.reservationId ?? data.id,
        userId: data.userId,
        roomId: data.roomId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },

  confirm: async (reservationId: string, token: string): Promise<{ reservationId: string; status: ReservationStatus }> => {
    try {
      const res = await fetch(`${API_URL}/reservations/confirm/${reservationId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to confirm reservation.");
      return await res.json();
    } catch (error) {
      console.error("Error confirming reservation:", error);
      throw error;
    }
  },

  cancel: async (reservationId: string, token: string): Promise<{ reservationId: string; status: ReservationStatus }> => {
    try {
      const res = await fetch(`${API_URL}/reservations/cancel/${reservationId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel reservation.");
      return await res.json();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      throw error;
    }
  },
};

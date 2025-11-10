import { create } from "zustand";
import type { Reservation } from "../features/reservations/types/Reservation.interface";
import type { ICreateReservation } from "../features/reservations/types/ICreateReservation";
import { reservationService } from "../features/reservations/services/ReservationService";
import Swal from "sweetalert2";

type ReservationState = {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  token: string | null;

  setToken: (token: string | null) => void;
  fetchReservations: (userId: string) => Promise<void>;
  refreshReservations: () => Promise<void>;
  createReservation: (data: ICreateReservation) => Promise<Reservation | void>;
  confirmReservation: (id: string) => Promise<Reservation | void>;
  cancelReservation: (reservationId: string, requesterUserId: string) => Promise<void>;
};

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  loading: false,
  error: null,
  token: null,

  setToken: (token) => set({ token }),

  fetchReservations: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const token = get().token ?? undefined;
      const res = await reservationService.listByUser(userId, token);
      set({ reservations: res, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Unknown error", loading: false });
    }
  },

  fetchAllReservations: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().token ?? undefined;
      const res = await reservationService.listAll(token!);
      set({ reservations: res, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Unknown error", loading: false });
    }
  },

  refreshReservations: async () => {
    return get().fetchReservations((get().reservations[0]?.user.id as string) || "");
  },

  createReservation: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "You must be logged in as admin to confirm a reservation.",
        });
        set({ loading: false });
        return;
      }
      const newR = await reservationService.create(data, token);
      set((state) => ({ reservations: [newR, ...state.reservations], loading: false }));
      return newR;
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to create reservation", loading: false });
    }
  },

  confirmReservation: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "You must be logged in as admin to confirm a reservation.",
        });
        set({ loading: false });
        return;
      }
      const updated = await reservationService.confirm(id, token);
      set((state) => ({
        reservations: state.reservations.map((r) => (r.id === updated.id ? updated : r)),
        loading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to confirm reservation", loading: false });
    }
  },

  cancelReservation: async (reservationId, requesterUserId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "You must be logged in as admin to confirm a reservation.",
        });
        set({ loading: false });
        return;
      }
      const res = await reservationService.cancel(reservationId, requesterUserId, token);

      if (res) {
        set((state) => ({
          reservations: state.reservations.map((r) => (r.id === (res as Reservation).id ? (res as Reservation) : r)),
          loading: false,
        }));
      } else {
        set((state) => ({ reservations: state.reservations.filter((r) => r.id !== reservationId), loading: false }));
      }
      return;
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to cancel reservation", loading: false });
    }
  },
}));

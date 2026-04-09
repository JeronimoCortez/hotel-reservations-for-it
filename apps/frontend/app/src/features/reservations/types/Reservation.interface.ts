import type { ReservationStatus } from "./ReservationStatus.enum";

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (exclusive)
  status: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}

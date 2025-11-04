import type { ReservationStatus } from "./ReservationStatus.enum";

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  startDate: string; 
  endDate: string;  
  status?: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}
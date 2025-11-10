import type { Room } from "../../rooms/types/Room.interface";
import type { User } from "../../users/types/User.interface";
import type { ReservationStatus } from "./ReservationStatus.enum";

export interface Reservation {
  id: string;
  user: User;
  room: Room;
  startDate: string; 
  endDate: string;  
  status?: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}
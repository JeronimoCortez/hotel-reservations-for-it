export interface ICreateReservation {
  roomId: string;
  userId?: string; // solo para ADMIN
  startDate: string;
  endDate: string; 
}

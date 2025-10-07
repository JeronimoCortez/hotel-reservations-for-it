import { RoomType } from "./RoomType";

export interface IRoom {
    id: string;
    number: number;
    type: RoomType;
    price: number;
    available: boolean;
}
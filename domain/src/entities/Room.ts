import { IRoom } from "../types/IRoom";
import { RoomType } from "../types/RoomType";


export class Room implements IRoom {
    constructor(
        public id: string,
        public number: number,
        public type: RoomType,
        public price: number,
        public available: boolean
    ) { }

    markAvailable() {
        this.available = true;
    }

    markUnavailable() {
        this.available = false;
    }
}
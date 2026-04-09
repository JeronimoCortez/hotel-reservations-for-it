import { IRoom } from "../types/IRoom";
import { RoomType } from "../types/RoomType";


export class Room implements IRoom {
    constructor(
        public id: string,
        public number: number,
        public type: RoomType,
        public price: number,
        public inService: boolean,
    ) { }

    putInService() {
        this.inService = true;
    }

    takeOutOfService() {
        this.inService = false;
    }
}

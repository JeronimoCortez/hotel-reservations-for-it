import { Room } from "../../entities/Room";

export interface IRoomRepository {
    findById(id: string): Promise<Room | null>;
    findAll(): Promise<Room[]>;
    save(room: Room): Promise<void>;
}

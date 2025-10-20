import { Room } from "../../../../domain/src/entities/Room";
import { RoomType } from "../../../../domain/src/types/RoomType";
import { IRoomRepository } from "../../../../domain/src/use-cases/ports/IRoomRepository";
import RoomModel from "../models/RoomModel";


export function mapToRoomType(type?: string | null): RoomType {
    switch (type) {
        case RoomType.SINGLE:
            return RoomType.SINGLE;
        case RoomType.DOUBLE:
            return RoomType.DOUBLE;
        case RoomType.SUITE:
            return RoomType.SUITE;
        default:
            return RoomType.SINGLE;
    }
}

export class MongoRoomRepository implements IRoomRepository {
    async findById(id: string): Promise<Room | null> {
        const room = await RoomModel.findById(id).lean();
        if (!room) return null;
        const type = mapToRoomType(room.type);

        return new Room(String(room._id), room.number ?? 0, type, room.price ?? 0, room.available ?? false)
    }

    async findAll(): Promise<Room[]> {
        const rooms = await RoomModel.find().lean();
        return rooms.map((r) => {
            const type = mapToRoomType(r.type);
            return new Room(String(r._id), r.number ?? 0, type, r.price ?? 0, r.available ?? false)
        })
    }

    async save(room: Room): Promise<void> {
        await RoomModel.updateOne(
            { _id: room.id },
            { _id: room.id, number: room.number, type: room.type, price: room.price, available: room.available },
            { upsert: true }
        )
    }
    async delete(id: string): Promise<void> {
        await RoomModel.deleteOne({ _id: id });
    }
}
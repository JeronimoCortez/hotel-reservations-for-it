import { Request, Response } from "express";
import { RoomType } from "../../../../domain/src/types/RoomType";
import { Room } from "../../../../domain/src/entities/Room";
import { MongoRoomRepository } from "../repositories/MongoRoomRepository";

const roomRepo = new MongoRoomRepository();

export class RoomController {
    static async createRoom(req: Request, res: Response) {
        try {
            const { number, type, price } = req.body;
            const room = new Room(
                crypto.randomUUID(),
                number,
                type as RoomType,
                price,
                true
            );

            await roomRepo.save(room);
            res.status(201).json(room);
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async getAllRooms(req: Request, res: Response) {
        try {
            const rooms = await roomRepo.findAll();
            res.status(200).json(rooms);
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async getRoomById(req: Request, res: Response) {
        try {
            const room = await roomRepo.findById(req.params.id);
            if (!room) return res.status(404).json({ message: "Room not found" })
            res.status(200).json(room);
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }
    static async updateRoom(req: Request, res: Response) {
        try {
            const { number, type, price, available } = req.body;
            const room = await roomRepo.findById(req.params.id);
            if (!room) return res.status(404).json({ message: "Room not found" });

            room.number = number ?? room.number;
            room.type = type ?? room.type;
            room.price = price ?? room.price;
            room.available = available ?? room.available;

            await roomRepo.save(room);
            res.status(200).json(room);
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async deleteRoom(req: Request, res: Response) {
        try {
            const room = await roomRepo.findById(req.params.id);
            if (!room) return res.status(404).json({ message: "Room not found" });

            await roomRepo.delete(req.params.id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }
}
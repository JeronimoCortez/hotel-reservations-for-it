import { Reservation } from "../../../../domain/src/entities/Reservation";
import { Room } from "../../../../domain/src/entities/Room";
import { User } from "../../../../domain/src/entities/User";
import { Roles } from "../../../../domain/src/types/Roles";
import { Status } from "../../../../domain/src/types/Status";
import { IReservationRepository } from "../../../../domain/src/use-cases/ports/IReservationRepository";
import ReservationModel from "../models/ReservationModel";
import RoomModel from "../models/RoomModel";
import UserModel from "../models/UserModel";
import { mapToRoomType } from "./MongoRoomRepository";

export class MongoReservationRepository implements IReservationRepository {
    async findById(id: string): Promise<Reservation | null> {
        const reservation = await ReservationModel.findById(id).lean();
        if (!reservation) return null;
        const userDoc = await UserModel.findById(reservation.userId).lean();
        const roomDoc = await RoomModel.findById(reservation.roomId).lean();
        if (!userDoc || !roomDoc) return null;
        const role = userDoc.role === Roles.ADMIN ? Roles.ADMIN : Roles.USER;
        const user = new User(String(userDoc._id), userDoc.name ?? "", userDoc.email ?? "", userDoc.password ?? "", role);
        const room = new Room(String(roomDoc._id), roomDoc.number ?? 0, mapToRoomType(roomDoc.type), roomDoc.price ?? 0, roomDoc.available ?? false);
        return new Reservation(reservation._id!, user, room, new Date(reservation.startDate!), new Date(reservation.endDate!), reservation.status as any);
    }

    async findByRoomAndRange(roomId: string, start: Date, end: Date): Promise<Reservation[]> {
        const reservations = await ReservationModel.find({
            roomId,
            $or: [
                { startDate: { $lt: end }, endDate: { $gt: start } }
            ]
        }).lean();

        const results: Reservation[] = [];

        for (const reservation of reservations) {
            const userDoc = await UserModel.findById(reservation.userId).lean();
            const roomDoc = await RoomModel.findById(reservation.roomId).lean();

            if (!userDoc || !roomDoc) continue;

            results.push(
                new Reservation(
                    String(reservation._id),
                    new User(
                        String(userDoc._id),
                        userDoc.name ?? "",
                        userDoc.email ?? "",
                        userDoc.password ?? "",
                        userDoc.role === "ADMIN" ? Roles.ADMIN : Roles.USER
                    ),
                    new Room(
                        String(roomDoc._id),
                        roomDoc.number ?? 0,
                        mapToRoomType(roomDoc.type),
                        roomDoc.price ?? 0,
                        roomDoc.available ?? false
                    ),
                    new Date(reservation.startDate!),
                    new Date(reservation.endDate!),
                    reservation.status === "CONFIRMED" ? Status.CONFIRMED :
                        reservation.status === "CANCELLED" ? Status.CANCELLED :
                            Status.PENDING
                )
            );
        }

        return results;
    }

    async save(reservation: Reservation): Promise<void> {
        await ReservationModel.updateOne(
            { _id: reservation.id },
            {
                _id: reservation.id,
                userId: reservation.user.id,
                roomId: reservation.room.id,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                status: reservation.status
            },
            { upsert: true }
        )
    }
    async findByRange(start: Date, end: Date): Promise<Reservation[]> {
        const reservations = await ReservationModel.find({
            $or: [
                { startDate: { $lt: end }, endDate: { $gt: start } }
            ]
        }).lean();

        const results: Reservation[] = [];

        for (const reservation of reservations) {
            const userDoc = await UserModel.findById(reservation.userId).lean();
            const roomDoc = await RoomModel.findById(reservation.roomId).lean();

            if (!userDoc || !roomDoc) continue; // saltar si no existe

            const status = reservation.status === "CONFIRMED" ? Status.CONFIRMED :
                reservation.status === "CANCELLED" ? Status.CANCELLED :
                    Status.PENDING;

            results.push(new Reservation(
                String(reservation._id),
                new User(
                    String(userDoc._id),
                    userDoc.name ?? "",
                    userDoc.email ?? "",
                    userDoc.password ?? "",
                    userDoc.role === "ADMIN" ? Roles.ADMIN : Roles.USER
                ),
                new Room(
                    String(roomDoc._id),
                    roomDoc.number ?? 0,
                    mapToRoomType(roomDoc.type),
                    roomDoc.price ?? 0,
                    roomDoc.available ?? false
                ),
                new Date(reservation.startDate!),
                new Date(reservation.endDate!),
                status
            ));
        }

        return results;
    }

    async delete(id: string): Promise<void> {
        await ReservationModel.deleteOne({ _id: id })
    }
}
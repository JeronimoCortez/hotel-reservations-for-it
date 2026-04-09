import { Reservation } from "../../../../domain/dist/entities/Reservation";
import { Room } from "../../../../domain/dist/entities/Room";
import { User } from "../../../../domain/dist/entities/User";
import { Roles } from "../../../../domain/dist/types/Roles";
import { Status } from "../../../../domain/dist/types/Status";
import { IReservationRepository } from "../../../../domain/dist/use-cases/ports/IReservationRepository";
import { LocalDate } from "../../../../domain/dist/value-objects/LocalDate";
import ReservationModel from "../models/ReservationModel";
import RoomModel from "../models/RoomModel";
import UserModel from "../models/UserModel";
import { mapToRoomType } from "./MongoRoomRepository";

function mapToStatus(raw?: string | null): Status {
    if (raw === Status.CONFIRMED) return Status.CONFIRMED;
    if (raw === Status.CANCELLED || raw === "CANDELLED") return Status.CANCELLED;
    return Status.PENDING;
}

export class MongoReservationRepository implements IReservationRepository {
    async findById(id: string): Promise<Reservation | null> {
        const reservation = await ReservationModel.findById(id).lean();
        if (!reservation) return null;
        const userDoc = await UserModel.findById(reservation.userId).lean();
        const roomDoc = await RoomModel.findById(reservation.roomId).lean();
        if (!userDoc || !roomDoc) return null;
        const role = userDoc.role === Roles.ADMIN ? Roles.ADMIN : Roles.USER;
        const user = new User(String(userDoc._id), userDoc.name ?? "", userDoc.email ?? "", "", role);
        const room = new Room(String(roomDoc._id), roomDoc.number ?? 0, mapToRoomType(roomDoc.type), roomDoc.price ?? 0, roomDoc.inService ?? true);
        return new Reservation(String(reservation._id), user, room, reservation.startDate as LocalDate, reservation.endDate as LocalDate, mapToStatus(reservation.status));
    }

    async findByRoomAndRange(roomId: string, start: LocalDate, end: LocalDate): Promise<Reservation[]> {
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
                        "",
                        userDoc.role === "ADMIN" ? Roles.ADMIN : Roles.USER
                    ),
                    new Room(
                        String(roomDoc._id),
                        roomDoc.number ?? 0,
                        mapToRoomType(roomDoc.type),
                        roomDoc.price ?? 0,
                        roomDoc.inService ?? true
                    ),
                    reservation.startDate as LocalDate,
                    reservation.endDate as LocalDate,
                    mapToStatus(reservation.status)
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
    async findByRange(start: LocalDate, end: LocalDate): Promise<Reservation[]> {
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

            const status = mapToStatus(reservation.status);

            results.push(new Reservation(
                String(reservation._id),
                new User(
                    String(userDoc._id),
                    userDoc.name ?? "",
                    userDoc.email ?? "",
                    "",
                    userDoc.role === "ADMIN" ? Roles.ADMIN : Roles.USER
                ),
                new Room(
                    String(roomDoc._id),
                    roomDoc.number ?? 0,
                    mapToRoomType(roomDoc.type),
                    roomDoc.price ?? 0,
                    roomDoc.inService ?? true
                ),
                reservation.startDate as LocalDate,
                reservation.endDate as LocalDate,
                status
            ));
        }

        return results;
    }

    async delete(id: string): Promise<void> {
        await ReservationModel.deleteOne({ _id: id })
    }
    async findByUser(userId: string): Promise<Reservation[]> {
        const reservations = await ReservationModel.find({ userId }).lean();
        const results: Reservation[] = [];

        for (const r of reservations) {
            const userDoc = await UserModel.findById(r.userId).lean();
            const roomDoc = await RoomModel.findById(r.roomId).lean();

            if (!userDoc || !roomDoc) continue;

            results.push(
                new Reservation(
                    String(r._id),
                    new User(
                        String(userDoc._id),
                        userDoc.name ?? "",
                        userDoc.email ?? "",
                        "",
                        userDoc.role as Roles
                    ),
                    new Room(
                        String(roomDoc._id),
                        roomDoc.number ?? 0,
                        mapToRoomType(roomDoc.type),
                        roomDoc.price ?? 0,
                        roomDoc.inService ?? true
                    ),
                    r.startDate as LocalDate,
                    r.endDate as LocalDate,
                    mapToStatus(r.status)
                )
            );
        }

        return results;
    }
    async findAll(): Promise<Reservation[]> {
        const reservations = await ReservationModel.find().lean();
        const results: Reservation[] = [];

        for (const r of reservations) {
            const userDoc = await UserModel.findById(r.userId).lean();
            const roomDoc = await RoomModel.findById(r.roomId).lean();

            if (!userDoc || !roomDoc) continue; // seguridad ante datos incompletos

            results.push(
                new Reservation(
                    String(r._id),
                    new User(
                        String(userDoc._id),
                        userDoc.name ?? "",
                        userDoc.email ?? "",
                        "",
                        userDoc.role as Roles
                    ),
                    new Room(
                        String(roomDoc._id),
                        roomDoc.number ?? 0,
                        mapToRoomType(roomDoc.type),
                        roomDoc.price ?? 0,
                        roomDoc.inService ?? true
                    ),
                    r.startDate as LocalDate,
                    r.endDate as LocalDate,
                    mapToStatus(r.status)
                )
            );
        }

        return results;
    }

}

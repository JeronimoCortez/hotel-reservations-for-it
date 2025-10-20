import { Request, Response } from "express";
import { CancelReservationUseCase } from "../../../../domain/src/use-cases/cancel-reservation/CancelReservationUseCase";
import { ConfirmReservationUseCase } from "../../../../domain/src/use-cases/confirm-reservation/ConfirmReservartionUseCase";
import { CreateReservationUseCase } from "../../../../domain/src/use-cases/create-reservation/CreateReservationUseCase";
import { MongoReservationRepository } from "../repositories/MongoReservationRepository";
import { MongoRoomRepository } from "../repositories/MongoRoomRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";


const reservationRepo = new MongoReservationRepository();
const userRepo = new MongoUserRepository();
const roomRepo = new MongoRoomRepository();

const createReservationUseCase = new CreateReservationUseCase(
    userRepo,
    roomRepo,
    reservationRepo
);
const cancelReservationUseCase = new CancelReservationUseCase(reservationRepo, userRepo);
const confirmReservationUseCase = new ConfirmReservationUseCase(reservationRepo);

export class ReservationController {
    static async create(req: Request, res: Response) {
        try {
            const { userId, roomId, startDate, endDate } = req.body;
            const result = await createReservationUseCase.execute({ userId, roomId, startDate: new Date(startDate).toISOString(), endDate: new Date(endDate).toISOString() });
            return res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async cancel(req: Request, res: Response) {
        try {
            const { reservationId, requesterUserId } = req.body;
            const result = await cancelReservationUseCase.execute(reservationId, requesterUserId);
            res.status(200).json(result);
        } catch (err) {
            res.status(403).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async confirm(req: Request, res: Response) {
        try {
            const { reservationId } = req.body;
            const result = await confirmReservationUseCase.execute(reservationId);
            res.status(200).json(result);
        } catch (err) {
            res.status(400).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async listByUser(req: Request, res: Response) {
        try {
            const reservations = await reservationRepo.findByUser(req.params.userId);
            res.status(200).json(reservations);
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async listAll(req: Request, res: Response) {
        try {
            const reservations = await reservationRepo.findAll();
            res.status(200).json(reservations);
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }
}
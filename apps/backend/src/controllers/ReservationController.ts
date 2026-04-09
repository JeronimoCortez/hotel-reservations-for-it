import { Request, Response } from "express";
import { CancelReservationUseCase } from "../../../../domain/dist/use-cases/cancel-reservation/CancelReservationUseCase";
import { ConfirmReservationUseCase } from "../../../../domain/dist/use-cases/confirm-reservation/ConfirmReservationUseCase";
import { CreateReservationUseCase } from "../../../../domain/dist/use-cases/create-reservation/CreateReservationUseCase";
import { Roles } from "../../../../domain/dist/types/Roles";
import { MongoReservationRepository } from "../repositories/MongoReservationRepository";
import { MongoRoomRepository } from "../repositories/MongoRoomRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { handleError } from "../utils/handleError";
import { randomUUID } from "crypto";

type AuthRequest = Request & {
    user?: {
        userId: string;
        role: Roles;
    };
};

function toReservationDTO(r: any) {
    return {
        reservationId: String(r.id),
        userId: String(r.user?.id),
        roomId: String(r.room?.id),
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status,
    };
}

const reservationRepo = new MongoReservationRepository();
const userRepo = new MongoUserRepository();
const roomRepo = new MongoRoomRepository();

const idGenerator = { generate: () => randomUUID() };

const createReservationUseCase = new CreateReservationUseCase(
    userRepo,
    roomRepo,
    reservationRepo,
    idGenerator
);
const cancelReservationUseCase = new CancelReservationUseCase(reservationRepo, userRepo);
const confirmReservationUseCase = new ConfirmReservationUseCase(reservationRepo, userRepo);

export class ReservationController {
    static async create(req: Request, res: Response) {
        try {
            const authReq = req as AuthRequest;
            if (!authReq.user) return res.status(401).json({ message: "Missing auth context" });

            const { roomId, startDate, endDate, userId } = req.body;
            const targetUserId =
                authReq.user.role === Roles.ADMIN && userId ? String(userId) : authReq.user.userId;

            const result = await createReservationUseCase.execute({
                userId: targetUserId,
                roomId,
                startDate,
                endDate
            });
            return res.status(201).json(result);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async cancel(req: Request, res: Response) {
        try {
            const authReq = req as AuthRequest;
            if (!authReq.user) return res.status(401).json({ message: "Missing auth context" });

            const reservationId = req.params.id;
            const result = await cancelReservationUseCase.execute(reservationId, authReq.user.userId);
            res.status(200).json(result);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async confirm(req: Request, res: Response) {
        try {
            const authReq = req as AuthRequest;
            if (!authReq.user) return res.status(401).json({ message: "Missing auth context" });

            const reservationId = req.params.id;
            const result = await confirmReservationUseCase.execute(reservationId, authReq.user.userId);
            res.status(200).json(result);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async listByUser(req: Request, res: Response) {
        try {
            const authReq = req as AuthRequest;
            if (!authReq.user) return res.status(401).json({ message: "Missing auth context" });

            if (authReq.user.role !== Roles.ADMIN && authReq.user.userId !== req.params.userId) {
                return res.status(403).json({ message: "Forbidden: You do not have access" });
            }

            const reservations = await reservationRepo.findByUser(req.params.userId);
            res.status(200).json(reservations.map(toReservationDTO));
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async listAll(req: Request, res: Response) {
        try {
            const reservations = await reservationRepo.findAll();
            res.status(200).json(reservations.map(toReservationDTO));
        } catch (err) {
            return handleError(res, err);
        }
    }
}

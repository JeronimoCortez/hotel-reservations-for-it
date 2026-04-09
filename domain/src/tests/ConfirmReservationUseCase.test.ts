import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Roles } from "../types/Roles";
import { RoomType } from "../types/RoomType";
import { Status } from "../types/Status";
import { ConfirmReservationUseCase } from "../use-cases/confirm-reservation/ConfirmReservationUseCase";
import { InMemoryReservationRepo, InMemoryUserRepo } from "./inMemoryRepo"


describe("ConfirmReservationUseCase", () => {
    let reservationRepo: InMemoryReservationRepo;
    let userRepo: InMemoryUserRepo;
    let useCase: ConfirmReservationUseCase;
    const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
    const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);

    beforeEach(() => {
        reservationRepo = new InMemoryReservationRepo();
        userRepo = new InMemoryUserRepo();
        useCase = new ConfirmReservationUseCase(reservationRepo, userRepo);
    })

    test("confirms a pending reservation", async () => {
        await userRepo.save(user);
        const existing = new Reservation("e1", user, room, "2025-11-10", "2025-11-11", Status.PENDING);
        await reservationRepo.save(existing);

        const result = await useCase.execute("e1", user.id);
        expect(result.reservationId).toBe("e1");
        expect(result.status).toBe(Status.CONFIRMED);

        const stored = await reservationRepo.findById("e1");
        expect(stored).not.toBeNull()
        expect(stored!.status).toBe(Status.CONFIRMED);
    });

    test("throws if reservation not found", async () => {
        await userRepo.save(user);
        await expect(useCase.execute("nope", user.id)).rejects.toThrow("Reservation not found");
    })

    test("throws if reservation cancelled", async () => {
        await userRepo.save(user);
        const r = new Reservation("r2", user, room, "2025-11-10", "2025-11-12", Status.CANCELLED);
        await reservationRepo.save(r);
        await expect(useCase.execute("r2", user.id)).rejects.toThrow("Cannot confirm a cancelled reservation");
    });

    test("idempotent when already confirmed", async () => {
        await userRepo.save(user);
        const r = new Reservation("r3", user, room, "2025-11-10", "2025-11-12", Status.CONFIRMED);
        await reservationRepo.save(r);
        const result = await useCase.execute("r3", user.id);
        expect(result.status).toBe(Status.CONFIRMED);
    });

    test("non-owner non-admin cannot confirm", async () => {
        const otherUser = new User("u2", "Other", "other@gmail.com", "123456", Roles.USER);
        await userRepo.save(otherUser);
        const r = new Reservation("r4", user, room, "2025-11-10", "2025-11-12", Status.PENDING);
        await reservationRepo.save(r);

        await expect(useCase.execute("r4", otherUser.id)).rejects.toThrow("Not authorized to confirm this reservation");
    });

    test("throws on conflict with another confirmed reservation", async () => {
        await userRepo.save(user);
        const pending = new Reservation("r5", user, room, "2025-11-10", "2025-11-12", Status.PENDING);
        const confirmed = new Reservation("r6", user, room, "2025-11-11", "2025-11-13", Status.CONFIRMED);
        await reservationRepo.save(pending);
        await reservationRepo.save(confirmed);

        await expect(useCase.execute("r5", user.id)).rejects.toThrow("Room not available for request dates");
    });
})

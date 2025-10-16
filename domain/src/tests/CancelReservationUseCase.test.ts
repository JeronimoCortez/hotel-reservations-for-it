import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Roles } from "../types/Roles";
import { RoomType } from "../types/RoomType";
import { Status } from "../types/Status";
import { CancelReservationUseCase } from "../use-cases/cancel-reservation/CancelReservationUseCase";
import { InMemoryReservationRepo, InMemoryUserRepo } from "./InMemoryRepo"


describe("CancelReservationUseCase", () => {
    let reservationRepo: InMemoryReservationRepo;
    let userRepo: InMemoryUserRepo;
    let useCase: CancelReservationUseCase;

    const owner = new User("u-owner", "Owner", "owner@gmail.com", "password", Roles.USER);
    const otherUser = new User("u-user", "User", "otherUser@gmail.com", "password", Roles.USER);
    const admin = new User("u-admin", "Admin", "admin@gmail.com", "password", Roles.ADMIN);
    const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);

    beforeEach(() => {
        reservationRepo = new InMemoryReservationRepo();
        userRepo = new InMemoryUserRepo();
        useCase = new CancelReservationUseCase(reservationRepo, userRepo);
    })

    test("Owner can cancel a reservation", async () => {
        await userRepo.save(owner);
        const res = new Reservation("res1", owner, room, new Date("2025-12-01"), new Date("2025-12-03"), Status.PENDING);
        await reservationRepo.save(res);

        const result = await useCase.execute("res1", "u-owner");
        expect(result.reservationId).toBe("res1");
        expect(result.status).toBe(Status.CANCELLED)

        const stored = await reservationRepo.findById("res1");
        expect(stored).not.toBeNull();
        expect(stored!.status).toBe(Status.CANCELLED);
        expect(room.available).toBe(true);
    })

    test("admin can cancel any reservation", async () => {
        await userRepo.save(owner);
        await userRepo.save(admin);

        const res = new Reservation("res2", owner, room, new Date("2025-12-05"), new Date("2025-12-07"), Status.CONFIRMED);
        await reservationRepo.save(res);

        const result = await useCase.execute("res2", "u-admin");
        expect(result.status).toBe(Status.CANCELLED);

        const stored = await reservationRepo.findById("res2");
        expect(stored!.status).toBe(Status.CANCELLED);
        expect(room.available).toBe(true);
    })

    test("non-owner non-admin cannot cancel", async () => {
        await userRepo.save(owner);
        await userRepo.save(otherUser);

        expect(await userRepo.findById("u-user")).not.toBeNull();

        const res = new Reservation("res3", owner, room, new Date("2025-12-10"), new Date("2025-12-12"), Status.PENDING);
        await reservationRepo.save(res);

        await expect(useCase.execute("res3", otherUser.id)).rejects.toThrow("Not authorized to cancel this reservation");

        const stored = await reservationRepo.findById("res3");
        expect(stored!.status).toBe(Status.PENDING);
    })

    test("throws if reservation not found", async () => {
        await userRepo.save(admin);
        await expect(useCase.execute("nope", "u-admin")).rejects.toThrow("Reservation not found");
    })

    test("idempotent when already cancelled", async () => {
        await userRepo.save(owner)
        const res = new Reservation("res4", owner, room, new Date("2025-12-15"), new Date("2025-12-16"), Status.CANCELLED);
        await reservationRepo.save(res);

        const result = await useCase.execute("res4", "u-owner");
        expect(result.status).toBe(Status.CANCELLED);
    })

    test("throws if requester user not found", async () => {
        await userRepo.save(owner);
        const res = new Reservation("res5", owner, room, new Date("2025-12-20"), new Date("2025-12-21"), Status.PENDING);
        await reservationRepo.save(res);

        await expect(useCase.execute("res5", "unknown-user")).rejects.toThrow("Requester user not found");
    })
})
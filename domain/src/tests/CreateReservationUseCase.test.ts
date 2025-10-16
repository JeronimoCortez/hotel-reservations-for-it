import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Roles } from "../types/Roles";
import { RoomType } from "../types/RoomType";
import { Status } from "../types/Status";
import { CreateReservationUseCase } from "../use-cases/create-reservation/CreateReservationUseCase";
import { InMemoryReservationRepo, InMemoryRoomRepo, InMemoryUserRepo } from "./InMemoryRepo"


describe("CreateReservationUseCase", () => {
    let userRepo: InMemoryUserRepo;
    let roomRepo: InMemoryRoomRepo;
    let reservationRepo: InMemoryReservationRepo;
    let useCase: CreateReservationUseCase;

    beforeEach(() => {
        userRepo = new InMemoryUserRepo();
        roomRepo = new InMemoryRoomRepo();
        reservationRepo = new InMemoryReservationRepo();
        useCase = new CreateReservationUseCase(userRepo, roomRepo, reservationRepo);
    });

    test("creates reservation when room available", async () => {
        const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
        await userRepo.save(user);
        const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);
        await roomRepo.save(room);

        const result = await useCase.execute({
            userId: "u1",
            roomId: "r1",
            startDate: "2025-11-01T00:00:00.000Z",
            endDate: "2025-11-03T00:00:00.000Z"
        })

        expect(result).toHaveProperty("reservationId");
        expect(result.roomId).toBe("r1");
        expect(result.userId).toBe("u1");

    })

    test("throws if room not available (overlap)", async () => {
        const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
        await userRepo.save(user);
        const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);
        await roomRepo.save(room);

        const existing = new Reservation("e1", user, room, new Date("2025-11-02"), new Date("2025-11-05"), Status.CONFIRMED as any);
        await reservationRepo.save(existing);

        await expect(useCase.execute({
            userId: "u1",
            roomId: "r1",
            startDate: "2025-11-03T00:00:00.000Z",
            endDate: "2025-11-04T00:00:00.000Z"
        })).rejects.toThrow("Room not available")
    })

    test("thorws for invalid dates", async () => {
        const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
        await userRepo.save(user);
        const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);
        await roomRepo.save(room);

        await expect(useCase.execute({
            userId: "u1",
            roomId: "r1",
            startDate: "invalid",
            endDate: "also-invalid"
        })).rejects.toThrow("Invalid dates")
    })

    test("throws when user or room not found", async () => {
        await expect(useCase.execute({
            userId: "nope",
            roomId: "r1",
            startDate: "2025-11-01",
            endDate: "2025-11-02"
        })).rejects.toThrow("User not found")

        const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
        await userRepo.save(user);
        await expect(useCase.execute({
            userId: "u1",
            roomId: "nope",
            startDate: "2025-11-01",
            endDate: "2025-11-02"
        })).rejects.toThrow("Room not found")
    })
})
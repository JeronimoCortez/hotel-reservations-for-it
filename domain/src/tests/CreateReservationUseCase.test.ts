import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Roles } from "../types/Roles";
import { RoomType } from "../types/RoomType";
import { Status } from "../types/Status";
import { CreateReservationUseCase } from "../use-cases/create-reservation/CreateReservationUseCase";
import { InMemoryReservationRepo, InMemoryRoomRepo, InMemoryUserRepo } from "./inMemoryRepo"


describe("CreateReservationUseCase", () => {
    let userRepo: InMemoryUserRepo;
    let roomRepo: InMemoryRoomRepo;
    let reservationRepo: InMemoryReservationRepo;
    let useCase: CreateReservationUseCase;
    const idGenerator = { generate: () => "res-generated" };

    beforeEach(() => {
        userRepo = new InMemoryUserRepo();
        roomRepo = new InMemoryRoomRepo();
        reservationRepo = new InMemoryReservationRepo();
        useCase = new CreateReservationUseCase(userRepo, roomRepo, reservationRepo, idGenerator);
    });

    test("creates reservation when room available", async () => {
        const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
        await userRepo.save(user);
        const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);
        await roomRepo.save(room);

        const result = await useCase.execute({
            userId: "u1",
            roomId: "r1",
            startDate: "2025-11-01",
            endDate: "2025-11-03"
        })

        expect(result).toHaveProperty("reservationId");
        expect(result.roomId).toBe("r1");
        expect(result.userId).toBe("u1");
        expect(result.startDate).toBe("2025-11-01");
        expect(result.endDate).toBe("2025-11-03");

    })

    test("throws if room not available (overlap)", async () => {
        const user = new User("u1", "Jeronimo", "jeronimo@gmail.com", "123456", Roles.USER);
        await userRepo.save(user);
        const room = new Room("r1", 101, RoomType.SINGLE, 15000, true);
        await roomRepo.save(room);

        const existing = new Reservation("e1", user, room, "2025-11-02", "2025-11-05", Status.CONFIRMED);
        await reservationRepo.save(existing);

        await expect(useCase.execute({
            userId: "u1",
            roomId: "r1",
            startDate: "2025-11-03",
            endDate: "2025-11-04"
        })).rejects.toThrow("Room not available for request dates")
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
        })).rejects.toThrow("startDate must be in YYYY-MM-DD format")
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

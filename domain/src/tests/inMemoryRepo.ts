import { Reservation } from "../entities/Reservation";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { IReservationRepository } from "../use-cases/ports/IReservationRepository";
import { IRoomRepository } from "../use-cases/ports/IRoomRepository";
import { IUserRepository } from "../use-cases/ports/IUserRepository";
import { DateRange } from "../value-objects/DateRange";
import { LocalDate } from "../value-objects/LocalDate";

export class InMemoryUserRepo implements IUserRepository {
  private items = new Map<string, User>();
  async findById(id: string) { return this.items.get(id) ?? null; }
  async findByEmail(email: string) {
    for (const u of this.items.values()) if (u.email === email) return u;
    return null;
  }
  async save(user: User) { this.items.set(user.id, user); }
  async findAll() { return Array.from(this.items.values()); }
}

export class InMemoryRoomRepo implements IRoomRepository {
  private items = new Map<string, Room>();
  async findById(id: string) { return this.items.get(id) ?? null; }
  async findAll() { return Array.from(this.items.values()); }
  async save(room: Room) { this.items.set(room.id, room); }
}

export class InMemoryReservationRepo implements IReservationRepository {
  private items = new Map<string, Reservation>();
  async findById(id: string) { return this.items.get(id) ?? null; }

  async findByRoomAndRange(roomId: string, start: LocalDate, end: LocalDate) {
    const requested = DateRange.create(start, end);
    return Array.from(this.items.values()).filter((r) =>
      r.room.id === roomId && r.range.overlaps(requested)
    );
  }

  async findByRange(start: LocalDate, end: LocalDate) {
    const requested = DateRange.create(start, end);
    return Array.from(this.items.values()).filter((r) => r.range.overlaps(requested));
  }

  async save(reservation: Reservation) { this.items.set(reservation.id, reservation); }
  async delete(id: string) { this.items.delete(id); }
}


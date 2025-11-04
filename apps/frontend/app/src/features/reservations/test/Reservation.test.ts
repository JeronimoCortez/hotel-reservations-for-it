import { describe, it, expect, beforeEach, vi } from "vitest";
import { act } from "react-dom/test-utils";
import { useReservationStore } from "../../../store/ReservationStore";

vi.mock("../services/ReservationService", () => ({
  reservationService: {
    listAll: vi.fn(() => Promise.resolve([
      { id: "1", roomId: "101", userId: "u1", startDate: "2025-01-01", endDate: "2025-01-02" },
    ])),
    create: vi.fn((payload) => Promise.resolve({ ...payload, id: "2" })),
    cancel: vi.fn(() => Promise.resolve({ id: "1" })),
    confirm: vi.fn(() => Promise.resolve({ id: "1" })),
  },
}));

describe("ReservationStore", () => {
  beforeEach(() => {
    useReservationStore.setState({ reservations: [] });
  });

  it("createReservation adds a new reservation", async () => {
    await act(async () => {
      await useReservationStore.getState().createReservation({ userId: "u2", roomId: "102", startDate: "2025-01-03", endDate: "2025-01-04" });
    });
    const { reservations } = useReservationStore.getState();
    expect(reservations.some(r => r.roomId === "102")).toBe(true);
  });
});

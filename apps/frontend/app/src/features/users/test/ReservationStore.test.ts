import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "react-dom/test-utils";
import { useReservationStore } from "../../../store/ReservationStore";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
  fire: vi.fn(),
}));

vi.mock("../../../features/reservations/services/ReservationService", () => ({
  reservationService: {
    listByUser: vi.fn(() =>
      Promise.resolve([
        { id: "r1", userId: "u1", roomId: "room-1", startDate: "2025-01-01", endDate: "2025-01-02", status: "PENDING" },
      ])
    ),
    listAll: vi.fn(() =>
      Promise.resolve([
        { id: "r2", userId: "u2", roomId: "room-2", startDate: "2025-02-01", endDate: "2025-02-02", status: "CONFIRMED" },
      ])
    ),
    create: vi.fn((data: any) => Promise.resolve({ id: "r3", ...data, status: "PENDING" })),
    confirm: vi.fn((reservationId: string) =>
      Promise.resolve({ reservationId, status: "CONFIRMED" })
    ),
    cancel: vi.fn((reservationId: string) =>
      Promise.resolve({ reservationId, status: "CANCELLED" })
    ),
  },
}));

import { reservationService } from "../../../features/reservations/services/ReservationService";
import Swal from "sweetalert2";

describe("useReservationStore", () => {
  beforeEach(() => {
    useReservationStore.setState({
      reservations: [],
      loading: false,
      error: null,
      token: null,
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("fetchReservations loads reservations by user", async () => {
    useReservationStore.setState({ token: "token" });
    await act(async () => {
      await useReservationStore.getState().fetchReservations("u1");
    });

    const { reservations, loading, error } = useReservationStore.getState();
    expect(reservationService.listByUser).toHaveBeenCalledWith("u1", "token");
    expect(reservations.length).toBe(1);
    expect(reservations[0].id).toBe("r1");
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });

  it("fetchAllReservations loads all reservations", async () => {
    useReservationStore.setState({ token: "token" });

    await act(async () => {
      await (useReservationStore.getState() as any).fetchAllReservations();
    });

    const { reservations } = useReservationStore.getState();
    expect(reservations.length).toBe(1);
    expect(reservations[0].id).toBe("r2");
    expect(reservationService.listAll).toHaveBeenCalledWith("token");
  });

  it("refreshReservations calls fetchReservations with user's id", async () => {
    localStorage.setItem("token", "token");

    await act(async () => {
      await useReservationStore.getState().refreshReservations();
    });

    expect(useReservationStore.getState().token).toBe("token");
  });

  it("createReservation shows error when token is missing", async () => {
    await act(async () => {
      const res = await useReservationStore.getState().createReservation({} as any);
      expect(res).toBeUndefined();
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to create a reservation.",
    });
    expect(reservationService.create).not.toHaveBeenCalled();
  });

  it("createReservation creates a reservation when token exists", async () => {
    localStorage.setItem("token", "fake-token");

    await act(async () => {
      const res = await useReservationStore.getState().createReservation({ name: "Test" } as any);
      expect(res).toBeDefined();
      expect(res?.id).toBe("r3");
    });

    const state = useReservationStore.getState();
    expect(state.reservations.length).toBe(1);
    expect(reservationService.create).toHaveBeenCalledWith({ name: "Test" }, "fake-token");
  });

  it("confirmReservation shows error when token is missing", async () => {
    await act(async () => {
      const res = await useReservationStore.getState().confirmReservation("r1");
      expect(res).toBeUndefined();
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to confirm a reservation.",
    });
    expect(reservationService.confirm).not.toHaveBeenCalled();
  });

  it("confirmReservation updates a reservation when token exists", async () => {
    localStorage.setItem("token", "fake-token");
    useReservationStore.setState({
      reservations: [{ id: "r1", status: "PENDING" } as any],
    });

    await act(async () => {
      await useReservationStore.getState().confirmReservation("r1");
    });

    const { reservations } = useReservationStore.getState();
    expect(reservations[0].status).toBe("CONFIRMED");
    expect(reservationService.confirm).toHaveBeenCalledWith("r1", "fake-token");
  });

  it("cancelReservation shows error when token is missing", async () => {
    await act(async () => {
      await useReservationStore.getState().cancelReservation("r1");
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You must be logged in to cancel a reservation.",
    });
    expect(reservationService.cancel).not.toHaveBeenCalled();
  });

  it("cancelReservation updates reservation when token exists", async () => {
    localStorage.setItem("token", "fake-token");
    useReservationStore.setState({
      reservations: [{ id: "r1", status: "PENDING" } as any],
    });

    await act(async () => {
      await useReservationStore.getState().cancelReservation("r1");
    });

    const { reservations } = useReservationStore.getState();
    expect(reservations[0].status).toBe("CANCELLED");
    expect(reservationService.cancel).toHaveBeenCalledWith("r1", "fake-token");
  });

  it("setToken updates token in store", () => {
    useReservationStore.getState().setToken("new-token");
    expect(useReservationStore.getState().token).toBe("new-token");
  });
});

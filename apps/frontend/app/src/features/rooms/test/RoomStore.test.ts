import { describe, it, expect, beforeEach, vi } from "vitest";

import { act } from "react-dom/test-utils";
import { useRoomStore } from "../../../store/RoomStore";

vi.mock("../services/RoomService", () => ({
  roomService: {
    getAllRooms: vi.fn(() => Promise.resolve([
      { id: "1", number: 101, type: "single", price: 100, available: true },
      { id: "2", number: 102, type: "double", price: 150, available: false },
    ])),
    createRoom: vi.fn((data) => Promise.resolve({ ...data, id: "3", available: true })),
    updateRoom: vi.fn((id, data) => Promise.resolve({ id, ...data })),
    deleteRoom: vi.fn(() => Promise.resolve(true)),
  },
}));

describe("RoomStore", () => {
  beforeEach(() => {
    useRoomStore.setState({ rooms: [] });
  });

  it("fetchRooms loads all rooms", async () => {
    await act(async () => {
      await useRoomStore.getState().fetchRooms();
    });
    const { rooms } = useRoomStore.getState();
    expect(rooms.length).toBe(2);
  });

  it("createRoom adds a new room", async () => {
    await act(async () => {
      await useRoomStore.getState().createRoom({ number: 103, type: "suite", price: 200 });
    });
    const { rooms } = useRoomStore.getState();
    expect(rooms.some(r => r.number === 103)).toBe(true);
  });
});

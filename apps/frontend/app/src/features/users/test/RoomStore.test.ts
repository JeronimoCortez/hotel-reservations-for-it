import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "react-dom/test-utils";
import { useRoomStore } from "../../../store/RoomStore";

vi.mock("../../../features/rooms/services/RoomService", () => ({
  roomService: {
    getAllRooms: vi.fn(() =>
      Promise.resolve([{ id: "r1", name: "Room 1", capacity: 4 }])
    ),
    createRoom: vi.fn((data: any) =>
      Promise.resolve({ id: "r2", ...data })
    ),
    updateRoom: vi.fn((id: string, data: any) =>
      Promise.resolve({ id, ...data })
    ),
    deleteRoom: vi.fn(() => Promise.resolve()),
  },
}));

import { roomService } from "../../../features/rooms/services/RoomService";

describe("useRoomStore", () => {
  beforeEach(() => {
    useRoomStore.setState({
      rooms: [],
      loading: false,
      error: null,
      token: null,
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("fetchRooms loads all rooms", async () => {
    await act(async () => {
      await useRoomStore.getState().fetchRooms();
    });

    const { rooms, loading, error } = useRoomStore.getState();
    expect(roomService.getAllRooms).toHaveBeenCalled();
    expect(rooms.length).toBe(1);
    expect(rooms[0].id).toBe("r1");
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });

  it("refreshRooms calls fetchRooms", async () => {
    await act(async () => {
      await useRoomStore.getState().refreshRooms();
    });

    expect(roomService.getAllRooms).toHaveBeenCalledTimes(1);
    expect(useRoomStore.getState().rooms.length).toBe(1);
  });

  it("createRoom sets error if token is missing", async () => {
    await act(async () => {
      const result = await useRoomStore.getState().createRoom({ name: "New" } as any);
      expect(result).toBeUndefined();
    });

    const state = useRoomStore.getState();
    expect(state.error).toBe("Auth token required to create room.");
    expect(roomService.createRoom).not.toHaveBeenCalled();
  });

  it("createRoom creates a room when token exists", async () => {
    localStorage.setItem("token", "fake-token");

    await act(async () => {
      const newRoom = await useRoomStore.getState().createRoom({ name: "Test Room", capacity: 8 } as any);
      expect(newRoom).toBeDefined();
      expect(newRoom?.id).toBe("r2");
    });

    const state = useRoomStore.getState();
    expect(roomService.createRoom).toHaveBeenCalledWith(
      { name: "Test Room", capacity: 8 },
      "fake-token"
    );
    expect(state.rooms.length).toBe(1);
    expect(state.rooms[0].id).toBe("r2");
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("updateRoom sets error if token is missing", async () => {
    await act(async () => {
      const result = await useRoomStore.getState().updateRoom("r1", { name: "Updated" } as any);
      expect(result).toBeUndefined();
    });

    const state = useRoomStore.getState();
    expect(state.error).toBe("Auth token required to update room.");
    expect(roomService.updateRoom).not.toHaveBeenCalled();
  });


  it("deleteRoom sets error if token is missing", async () => {
    await act(async () => {
      await useRoomStore.getState().deleteRoom("r1");
    });

    const state = useRoomStore.getState();
    expect(state.error).toBe("Auth token required to delete room.");
    expect(roomService.deleteRoom).not.toHaveBeenCalled();
  });

  it("deleteRoom removes room when token exists", async () => {
    useRoomStore.setState({ token: "fake-token", rooms: [{ id: "r1", name: "Room" }] as any });

    await act(async () => {
      await useRoomStore.getState().deleteRoom("r1");
    });

    const { rooms, error } = useRoomStore.getState();
    expect(rooms.length).toBe(0);
    expect(error).toBeNull();
    expect(roomService.deleteRoom).toHaveBeenCalledWith("r1", "fake-token");
  });

  it("setToken updates the token in store", () => {
    useRoomStore.getState().setToken("my-token");
    expect(useRoomStore.getState().token).toBe("my-token");
  });
});

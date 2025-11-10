import { create } from "zustand";
import type { Room } from "../features/rooms/types/Room.interface";
import type { ICreateRoom } from "../features/rooms/types/ICreateRoom";
import type { IUpdateRoom } from "../features/rooms/types/IUpdateRoom";
import { roomService } from "../features/rooms/services/RoomService";


type RoomState = {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  token: string | null;

  // actions
  setToken: (token: string | null) => void;
  fetchRooms: () => Promise<void>;
  refreshRooms: () => Promise<void>; // alias para fetchRooms
  createRoom: (data: ICreateRoom) => Promise<Room | void>;
  updateRoom: (id: string, data: IUpdateRoom) => Promise<Room | void>;
  deleteRoom: (id: string) => Promise<void>;
};

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  loading: false,
  error: null,
  token: null,

  setToken: (token) => set({ token }),

  fetchRooms: async () => {
    set({ loading: true, error: null });
    try {
      const rooms = await roomService.getAllRooms();
      set({ rooms, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Unknown error", loading: false });
    }
  },

  refreshRooms: async () => {
    await get().fetchRooms();
  },

  createRoom: async (data) => {
    const token = localStorage.getItem("token");
    console.log("Room create, ", token);
    
    if (!token) {
      set({ error: "Auth token required to create room." });
      return;
    }
    set({ loading: true, error: null });
    try {
      const newRoom = await roomService.createRoom(data, token);
      set((state) => ({ rooms: [newRoom, ...state.rooms], loading: false }));
      return newRoom;
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to create room", loading: false });
    }
  },

  updateRoom: async (id, data) => {
    const token = get().token;
    if (!token) {
      set({ error: "Auth token required to update room." });
      return;
    }
    set({ loading: true, error: null });
    try {
      const updated = await roomService.updateRoom(id, data, token);
      set((state) => ({
        rooms: state.rooms.map((r) => (r.id === id ? updated : r)),
        loading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to update room", loading: false });
    }
  },

  deleteRoom: async (id) => {
    const token = get().token;
    if (!token) {
      set({ error: "Auth token required to delete room." });
      return;
    }
    set({ loading: true, error: null });
    try {
      await roomService.deleteRoom(id, token);
      set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id), loading: false }));
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to delete room", loading: false });
    }
  },
}));

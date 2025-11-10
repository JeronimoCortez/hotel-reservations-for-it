import { useEffect } from "react";
import { useRoomStore } from "../store/RoomStore";
import CardRoom from "./CardRoom";

const ListRoom = () => {
  const { rooms, loading, error, fetchRooms, setToken } = useRoomStore();
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  return (
    <div className="my-4 flex items-center justify-center flex-wrap gap-2">
      {rooms.length > 0 ? (
        rooms.map((r) => <CardRoom key={r.id} room={r} />)
      ) : (
        <p className="text-center mt-2 font-bold">No rooms available</p>
      )}
    </div>
  );
};

export default ListRoom;

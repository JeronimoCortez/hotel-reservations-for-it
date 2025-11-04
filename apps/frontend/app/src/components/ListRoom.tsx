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
    <div className="flex gap-4 md:min-h-[80vh] my-2 justify-center items-center flex flex-col md:flex-row md:flex-wrap">
      {rooms.map((r) => (
        <CardRoom room={r} />
      ))}
    </div>
  );
};

export default ListRoom;

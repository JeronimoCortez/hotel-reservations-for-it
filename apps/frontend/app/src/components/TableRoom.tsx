import { Plus, Trash } from "lucide-react";
import { useRoomStore } from "../store/RoomStore";
import { useEffect, useState } from "react";
import CreateRoomForm from "./CreateRoomForm";

const TableRoom = () => {
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const { rooms, loading, error, fetchRooms, setToken } = useRoomStore();
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    fetchRooms();
  }, []);


  const handleOpenModal = () => {
    if (openCreateRoom) {
      setOpenCreateRoom(false);
    } else {
      setOpenCreateRoom(true);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 mx-auto">
        <h2 className="text-center text-xl font-bold">Rooms</h2>
        <button onClick={handleOpenModal} className="all:unset border rounded-full p-1 mt-1 text-[#134074] cursor-pointer">
          <Plus />
        </button>
      </div>
      {rooms.map((r) => (
        <div className="flex justify-around max-w-full m-4 bg-[#134074] p-4 text-white">
          <p>ID: {r.id}</p>
          {r.available ? <p>YES</p> : <p>NO</p>}

          <p>Number: {r.number}</p>
          <p>Price: ${r.price}</p>
          <p>Type: {r.type}</p>
          <button className="cursor-pointer">
            <Trash />
          </button>
        </div>
      ))}
      {openCreateRoom && <CreateRoomForm/>}
    </div>
  );
};

export default TableRoom;

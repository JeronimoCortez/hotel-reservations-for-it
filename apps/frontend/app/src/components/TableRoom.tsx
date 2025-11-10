import { Edit, Plus, Trash } from "lucide-react";
import { useRoomStore } from "../store/RoomStore";
import { useEffect, useState } from "react";
import CreateRoomForm from "./CreateRoomForm";
import Swal from "sweetalert2";
import type { Room } from "../features/rooms/types/Room.interface";
import EditRoomForm from "./EditRoomForm";

const TableRoom = () => {
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const { rooms, fetchRooms, setToken, deleteRoom } = useRoomStore();
  const [roomSelected, setRoomSelected] = useState<Room | null>();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    fetchRooms();
    
    
  }, []);

  useEffect(()=>{
    console.log(rooms);
  })
  const handleOpenModal = () => {
    if (openCreateRoom) {
      setOpenCreateRoom(false);
    } else {
      setOpenCreateRoom(true);
    }
  };

  const handleOpenEditModal = (room: Room) => {
    if (!openEditRoom) {
      setOpenEditRoom(true);
      setRoomSelected(room)
    } else {
      setOpenEditRoom(false);
      setRoomSelected(null)
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the room.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await deleteRoom(id);
        Swal.fire({
          icon: "success",
          title: "Room deleted",
          text: "The room has been successfully removed.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Action canceled",
          text: "The room was not deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while deleting the room. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 mx-auto">
        <h2 className="text-center text-xl font-bold">Rooms</h2>
        <button
          onClick={handleOpenModal}
          className="all:unset border rounded-full p-1 mt-1 text-[#134074] cursor-pointer"
        >
          <Plus />
        </button>
      </div>
      {rooms.map((r) => (
        <div
          key={r.id}
          className="flex justify-around max-w-full m-4 bg-[#134074] p-4 text-white"
        >
          <p>ID: {r.id}</p>
          {r.available ? <p>YES</p> : <p>NO</p>}

          <p>Number: {r.number}</p>
          <p>Price: ${r.price}</p>
          <p className="uppercase">Type: {r.type}</p>
          <div className="flex gap-2">
            <button className="cursor-pointer" onClick={() => handleOpenEditModal(r)}>
              <Edit />
            </button>
            <button
              className="cursor-pointer"
              onClick={() => handleDeleteRoom(r.id)}
            >
              <Trash />
            </button>
          </div>
        </div>
      ))}
      {openCreateRoom && <CreateRoomForm onClose={handleOpenModal} />}
      {openEditRoom && <EditRoomForm onClose={() => handleOpenEditModal(roomSelected!)} room={roomSelected!}/>}
    </div>
  );
};

export default TableRoom;

import type { FC } from "react";
import type { Room } from "../features/rooms/types/Room.interface";
import { useReservationStore } from "../store/ReservationStore";
import Swal from "sweetalert2";

const roomImages: Record<string, string> = {
  single: "/SingleRoom.png",
  double: "/DoubleRoom.png",
  suite: "/Suite.png",
};

type IPropsCardRoom = {
  room: Room;
};

const CardRoom: FC<IPropsCardRoom> = ({ room }) => {
  const { createReservation } = useReservationStore();

  const handleReserve = async () => {
    const checkInInput = document.getElementById("check-in") as HTMLInputElement;
    const checkOutInput = document.getElementById("check-out") as HTMLInputElement;

    if (!checkInInput?.value || !checkOutInput?.value) {
      await Swal.fire({
        icon: "warning",
        title: "Missing dates",
        text: "Please select check-in and check-out dates.",
        confirmButtonColor: "#134074",
      });
      return;
    }

    try {
      const userData = localStorage.getItem("user-storage");
      if (!userData) {
        await Swal.fire({
          icon: "error",
          title: "User not found",
          text: "Please log in before making a reservation.",
          confirmButtonColor: "#134074",
        });
        return;
      }

      const { state } = JSON.parse(userData);
      const userId = state?.user?.id;

      if (!userId) {
        await Swal.fire({
          icon: "error",
          title: "Invalid user data",
          text: "Could not retrieve user information.",
          confirmButtonColor: "#134074",
        });
        return;
      }

      await createReservation({
        userId,
        roomId: room.id,
        startDate: checkInInput.value,
        endDate: checkOutInput.value,
      });

      await Swal.fire({
        icon: "success",
        title: "Reservation successful",
        text: "Your reservation has been created successfully!",
        confirmButtonColor: "#134074",
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message ?? "Failed to create reservation.",
        confirmButtonColor: "#134074",
      });
    }
  };

  return (
    <div className="w-full max-w-sm bg-[#134074] p-5 rounded-lg shadow-md flex flex-col items-stretch gap-3 text-white">
      <img
        src={roomImages[room.type] || "/default-room.png"}
        alt={`${room.type.charAt(0).toUpperCase() + room.type.slice(1)} room image`}
        className="w-full h-40 object-cover rounded-md shadow-sm"
      />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
        </h3>
        <span className="text-xl font-bold">${room.price}</span>
      </div>

      <p className="text-sm text-white/80">
        Room number: <span className="font-medium">{room.number}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        <label className="flex flex-col text-xs">
          <span className="mb-1">Check-in</span>
          <input
            name="checkin"
            aria-label="Check-in date"
            type="date"
            id="check-in"
            className="rounded-md px-3 py-2 border border-[#fff] text-white bg-transparent"
          />
        </label>

        <label className="flex flex-col text-xs">
          <span className="mb-1">Check-out</span>
          <input
            name="checkout"
            aria-label="Check-out date"
            type="date"
            id="check-out"
            className="rounded-md px-3 py-2 border border-[#fff] text-white bg-transparent"
          />
        </label>
      </div>

      <div className="mt-3">
        <button
          onClick={handleReserve}
          type="button"
          className="w-full bg-white text-[#134074] font-semibold py-2 rounded-md shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={`Reserve ${room.type} room`}
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

export default CardRoom;

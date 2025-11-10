import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useReservationStore } from "../store/ReservationStore";
import CreateReservationForm from "./CreateReservationForm";
import type { Reservation } from "../features/reservations/types/Reservation.interface";
import Swal from "sweetalert2";

const TableReservation = () => {
  const {
    reservations,
    loading,
    error,
    fetchAllReservations,
    setToken,
    confirmReservation,
    cancelReservation
  } = useReservationStore() as any;

  const [openModal, setOpenModal] = useState<boolean>(false);

  const fetch = async () => {
    const token = localStorage.getItem("token");
    setToken(token);

    await fetchAllReservations();
  };

  useEffect(() => {
    fetch();
    console.log(reservations);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const handleOpenForm = () => {
    if (openModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to confirm this reservation?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#134074",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, confirm it",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Confirming...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await confirmReservation(id);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Reservation confirmed!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to confirm reservation.",
      });
    }
  };

  const handleCancel = async (
    reservationId: string,
    requesterUserId: string
  ) => {
    try {
      // 🔹 Confirmación previa
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to cancel this reservation?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#134074",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it",
      });

      if (!result.isConfirmed) return;

      // 🔹 Loading
      Swal.fire({
        title: "Cancelling reservation...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await cancelReservation(reservationId, requesterUserId);

      Swal.close();

      // 🔹 Éxito
      Swal.fire({
        icon: "success",
        title: "Reservation cancelled!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to cancel reservation.",
      });
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 mx-auto">
        <h2 className="text-center text-xl font-bold">Reservations</h2>
        <button
          onClick={handleOpenForm}
          className="all:unset border rounded-full p-1 mt-1 text-[#134074] cursor-pointer"
          aria-label="Create reservation"
        >
          <Plus />
        </button>
      </div>

      {reservations.map((r: Reservation) => (
        <div
          key={r.id}
          className="flex flex-wrap items-center justify-around max-w-full m-4 bg-[#134074] p-4 text-white rounded"
        >
          <p className="min-w-[120px]">ID: {r.id}</p>
          <p className="min-w-[140px]">User: {r.user.name}</p>
          <p className="min-w-[140px]">Room: {r.room.number}</p>
          <p className="min-w-[160px]">
            From: {new Date(r.startDate).toLocaleDateString()}
          </p>
          <p className="min-w-[160px]">
            To: {new Date(r.endDate).toLocaleDateString()}
          </p>
          <p className="min-w-[110px]">Status: {r.status ?? "pending"}</p>

          <div className="flex items-center gap-2">
            <button
            onClick={() => handleCancel(r.id, r.user.id)}
              className="p-2 rounded bg-white/10 hover:bg-white/20"
              aria-label={`Cancel reservation ${r.id}`}
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirm(r.id)}
              className="p-2 rounded bg-white/10 hover:bg-white/20"
              aria-label={`Cancel reservation ${r.id}`}
            >
              Confirm
            </button>
          </div>
        </div>
      ))}
      {openModal && <CreateReservationForm onClose={handleOpenForm} />}
    </div>
  );
};

export default TableReservation;

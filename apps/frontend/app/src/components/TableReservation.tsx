import { Plus, Trash } from "lucide-react"; // ajustá path si es distinto
import { useEffect } from "react";
import { useReservationStore } from "../store/ReservationStore";

const TableReservation = () => {
  const {
    reservations,
    loading,
    error,
    fetchReservations,       
    fetchAllReservations,    
    setToken,
  } = useReservationStore() as any; 

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);

    if (typeof fetchAllReservations === "function") {
      fetchAllReservations().catch(() => {});
    } else {
      const userId = localStorage.getItem("userId");
      if (userId && typeof fetchReservations === "function") {
        fetchReservations(userId).catch(() => {});
      } else {
      }
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 mx-auto">
        <h2 className="text-center text-xl font-bold">Reservations</h2>
        <button className="all:unset border rounded-full p-1 mt-1 text-[#134074] cursor-pointer" aria-label="Create reservation">
          <Plus />
        </button>
      </div>

      {reservations.map((r: any) => (
        <div
          key={r.id}
          className="flex flex-wrap items-center justify-around max-w-full m-4 bg-[#134074] p-4 text-white rounded"
        >
          <p className="min-w-[120px]">ID: {r.id}</p>
          <p className="min-w-[140px]">User: {r.userId}</p>
          <p className="min-w-[140px]">Room: {r.roomId}</p>
          <p className="min-w-[160px]">From: {new Date(r.startDate).toLocaleDateString()}</p>
          <p className="min-w-[160px]">To: {new Date(r.endDate).toLocaleDateString()}</p>
          <p className="min-w-[110px]">Status: {r.status ?? "pending"}</p>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded bg-white/10 hover:bg-white/20" aria-label={`View reservation ${r.id}`}>
              View
            </button>

            <button className="p-2 rounded bg-white/10 hover:bg-white/20" aria-label={`Cancel reservation ${r.id}`}>
              <Trash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableReservation;

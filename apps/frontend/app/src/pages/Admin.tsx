import { useEffect, useState } from "react";
import TableRoom from "../components/TableRoom";
import TableReservation from "../components/TableReservation";
import TableUser from "../components/TableUser";
import { useUserStore } from "../store/UserStore";
import { useNavigate } from "react-router-dom";


const AdminPanel = () => {
  const [view, setView] = useState<"rooms" | "reservations" | "users">("rooms");
    const { user, token } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenstor = localStorage.getItem("token");
    console.log(tokenstor);
    console.log(token);
    
    
    if (user && user.role !== "ADMIN") {
      navigate("/"); // redirige al home si no es admin
    }
  }, [user, navigate]);

  if (!user) {
    return <p className="font-bold text-center">Loading...</p>;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="w-full text-center mt-4">
        <p className="text-red-600 font-semibold">NOT PERMISSION PAGE - 401</p>
      </div>
    );
  }
  return (
    <div className="h-[80vh]">
      <nav className="bg-[#134074] text-white p-3 mb-4">
        <ul className="flex gap-4 justify-center">
          <li>
            <button className="cursor-pointer hover:underline" onClick={() => setView("rooms")}>Rooms</button>
          </li>
          <li>
            <button className="cursor-pointer hover:underline" onClick={() => setView("reservations")}>Reservations</button>
          </li>
          <li>
            <button className="cursor-pointer hover:underline" onClick={() => setView("users")}>Users</button>
          </li>
        </ul>
      </nav>

      <div className="p-4">
        {view === "rooms" && <TableRoom />}
        {view === "reservations" && <TableReservation />}
        {view === "users" && <TableUser />}
      </div>
    </div>
  );
};

export default AdminPanel;

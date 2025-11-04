import { useState } from "react";
import TableRoom from "../components/TableRoom";
import TableReservation from "../components/TableReservation";
import TableUser from "../components/TableUser";


const AdminPanel = () => {
  const [view, setView] = useState<"rooms" | "reservations" | "users">("rooms");

  return (
    <div>
      <nav className="bg-[#134074] text-white p-3 mb-4">
        <ul className="flex gap-4">
          <li>
            <button onClick={() => setView("rooms")}>Rooms</button>
          </li>
          <li>
            <button onClick={() => setView("reservations")}>Reservations</button>
          </li>
          <li>
            <button onClick={() => setView("users")}>Users</button>
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

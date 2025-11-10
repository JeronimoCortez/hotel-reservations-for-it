import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/UserStore";
import CreateUser from "./CreateUserForm";

const TableUser = () => {
  const { users, loading, error, fetchUsers, setToken } = useUserStore();
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const handleOpenModal = () => {
    if (openModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] overflow-y-auto">
      <div className="flex items-center gap-5 mx-auto">
        <h2 className="text-center text-xl font-bold">Users</h2>
        <button
          onClick={handleOpenModal}
          className="all:unset border rounded-full p-1 mt-1 text-[#134074] cursor-pointer"
          aria-label="Create user"
        >
          <Plus />
        </button>
      </div>

      {users.map((u) => (
        <div
          key={u.id}
          className="flex justify-around items-center max-w-full m-4 bg-[#134074] p-4 text-white rounded"
        >
          <p className="min-w-[160px]">Name: {u.name}</p>
          <p className="min-w-[200px]">Email: {u.email}</p>
          <p className="min-w-[120px]">Role: {u.role}</p>

        </div>
      ))}
      {openModal && <CreateUser onClose={handleOpenModal}/>}
    </div>
  );
};

export default TableUser;

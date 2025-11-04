import { Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { useUserStore } from "../store/UserStore";

const TableUser = () => {
  const { users, loading, error, fetchUsers, setToken } = useUserStore();
  
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 mx-auto">
        <h2 className="text-center text-xl font-bold">Users</h2>
        <button
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

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded bg-white/10 hover:bg-white/20"
              aria-label={`Edit user ${u.id}`}
            >
              Edit
            </button>
            <button
              className="p-2 rounded bg-white/10 hover:bg-white/20"
              aria-label={`Delete user ${u.id}`}
            >
              <Trash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableUser;

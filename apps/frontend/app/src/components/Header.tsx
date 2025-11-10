import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/UserStore";

const Header = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/")
  };

  return (
    <div className="h-[60px] border-b border-[#134074] flex justify-around items-center">
      <a href="/" className="text-2xl font-bold text-blue-900">
        Hotels Reservation For IT
      </a>

      <nav>
        <ul className="flex gap-4">
          {user ? (
            user.role === "ADMIN" ? (
              <>
                <li>
                  <a
                    onClick={handleLogout}
                    className="text-blue-600 hover:underline"
                    href="/"
                  >
                    Log Out
                  </a>
                </li>
                <li>
                  <a className="text-blue-600 hover:underline" href="/admin">
                    Admin
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-blue-600 hover:underline"
                  >
                    Log Out
                  </button>
                </li>
                <li>
                  <a className="text-blue-600 hover:underline" href="/rooms">
                    Reserve
                  </a>
                </li>
              </>
            )
          ) : (
            <>
              <li>
                <a className="text-blue-600 hover:underline" href="/login">
                  Sign in
                </a>
              </li>
              <li>
                <a className="text-blue-600 hover:underline" href="/register">
                  Join
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;

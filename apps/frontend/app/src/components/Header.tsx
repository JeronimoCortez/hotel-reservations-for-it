
const Header = () => {
  return (
    <div className="h-[60px] border-b border-[#134074] flex justify-around items-center">
      <a href="/" className="text-2xl font-bold text-blue-900">  Hotels Reservation For IT</a>
      <nav >
        <ul className="flex gap-2">
            <li><a className="text-blue-600 hover:underline" href="/login">Sign in</a></li>
            <li><a className="text-blue-600 hover:underline" href="/register">Join</a></li>
            <li><a className="text-blue-600 hover:underline" href="/admin">Admin</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default Header

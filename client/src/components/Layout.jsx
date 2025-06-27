import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">FocusList</h1>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-500">
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-500">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="text-sm text-gray-500">👋 {user.username}</span>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;

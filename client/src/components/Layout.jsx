import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="transition hover:opacity-80">
            <h1 className="text-2xl font-bold text-blue-600">FocusList</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-500 font-medium transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                  Register
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium ml-2">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 text-sm">
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;

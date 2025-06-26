import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // 立即更新状态
    navigate('/login');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">FocusList</h1>
        <nav className="flex items-center space-x-4">
          <a href="/" className="hover:text-blue-500">
            Home
          </a>

          {!user && (
            <>
              <a href="/login" className="hover:text-blue-500">
                Login
              </a>
              <a href="/register" className="hover:text-blue-500">
                Register
              </a>
            </>
          )}

          {user && (
            <>
              <span className="text-sm text-gray-500">👋 {user.username}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
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

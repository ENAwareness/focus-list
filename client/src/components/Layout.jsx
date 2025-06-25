const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">FocusList</h1>
        <nav>
          <a href="/" className="mr-4 hover:text-blue-500">
            Home
          </a>

          <a href="/login" className="mr-4 hover:text-blue-500">
            Login
          </a>
          <a href="/register" className="hover:text-blue-500">
            Register
          </a>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="bg-red-500 text-white px-3 py-1 rounded ml-4">
            Logout
          </button>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="transition hover:opacity-80">
            <h1 className="text-2xl font-bold text-blue-600">FocusList</h1>
          </Link>
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Language Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center text-gray-600 hover:text-blue-500 transition px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.916 17.916 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.004 9.004 0 013 12c0-1.612.448-3.113 1.22-4.418"
                  />
                </svg>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">
                  {lang === 'ja' ? '日本語' : 'English'}
                </span>
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <ul className="py-1">
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setLang('ja');
                          setLangDropdownOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm ${
                          lang === 'ja'
                            ? 'font-semibold text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                        日本语
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setLang('en');
                          setLangDropdownOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm ${
                          lang === 'en'
                            ? 'font-semibold text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                        English
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <nav className="flex items-center space-x-2 sm:space-x-6">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-500 font-medium transition px-1 sm:px-0 text-xs sm:text-base">
                    {lang === 'ja' ? 'ログイン' : 'Login'}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 sm:px-4 rounded-lg transition-transform transform hover:scale-105 text-xs sm:text-base whitespace-nowrap">
                    {lang === 'ja' ? '新規登録' : 'Register'}
                  </Link>
                </>
              )}
              {user && (
                <div className="flex items-center space-x-1 sm:space-x-4">
                  <div className="flex items-center text-gray-700 shrink-0">
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
                    <span className="font-medium ml-2 hidden sm:inline">{user.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 sm:px-4 rounded-lg transition-transform transform hover:scale-105 text-xs sm:text-sm shrink-0 whitespace-nowrap">
                    {lang === 'ja' ? 'ログアウト' : 'Logout'}
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;

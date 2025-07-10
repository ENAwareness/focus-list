import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { lang } = useLanguage();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const performLogin = async (credentials) => {
    setMessage('');
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/users/login', credentials);
      // 使用 context 中的 login 函数，它会处理状态更新和页面跳转
      login({ username: res.data.username }, res.data.token);
    } catch (err) {
      setMessage(
        err.response?.data?.error || (lang === 'ja' ? 'ログインに失敗しました。' : 'Login failed.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(form);
  };

  const handleGuestLogin = () => {
    performLogin({ email: 'aware@example.com', password: '123456' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {lang === 'ja' ? '目標に、集中しよう' : 'Focus on Your Goals'}
          </h2>
          <p className="text-gray-500 mt-2 text-base sm:text-lg text-center whitespace-nowrap">
            {lang === 'ja'
              ? 'シンプルなポモドーロ・タスク管理ツール'
              : 'The simple Pomodoro & Task Manager'}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            name="email"
            placeholder={lang === 'ja' ? 'メールアドレス' : 'Email'}
            type="email"
            onChange={handleChange}
          />
          <input
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            name="password"
            placeholder={lang === 'ja' ? 'パスワード' : 'Password'}
            type="password"
            onChange={handleChange}
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}>
            {isLoading
              ? lang === 'ja'
                ? '処理中...'
                : 'Processing...'
              : lang === 'ja'
              ? 'ログイン'
              : 'Login'}
          </button>
        </form>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">
            {lang === 'ja' ? 'または' : 'OR'}
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          onClick={handleGuestLogin}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading}>
          {lang === 'ja' ? 'ゲストとしてログイン' : 'Login as Guest'}
        </button>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;

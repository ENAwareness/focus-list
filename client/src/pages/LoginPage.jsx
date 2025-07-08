import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const { lang } = useLanguage();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axiosInstance.post('/users/login', form);
      // 使用 context 中的 login 函数，它会处理状态更新和页面跳转
      login({ username: res.data.username }, res.data.token);
    } catch (err) {
      setMessage(
        err.response?.data?.error || (lang === 'ja' ? 'ログインに失敗しました。' : 'Login failed.')
      );
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-10">
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
        <h2 className="text-2xl font-bold text-gray-800">
          {lang === 'ja' ? 'Focus Listへようこそ' : 'Welcome to Focus List'}
        </h2>
        <p className="text-gray-500 mt-2">
          {lang === 'ja'
            ? 'ポモドーロとタスク管理で、最高の集中を。'
            : 'Achieve peak focus with Pomodoro and task management.'}
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
          type="submit">
          {lang === 'ja' ? 'ログイン' : 'Login'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default LoginPage;

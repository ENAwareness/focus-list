import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useLanguage } from '../context/LanguageContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    try {
      const res = await axiosInstance.post('/users/register', form);
      setIsSuccess(true);
      setMessage(
        lang === 'ja'
          ? `✅ ようこそ、${res.data.username || 'user'}さん！ログイン画面に移動します...`
          : `✅ Welcome, ${res.data.username || 'user'}! Redirecting to login...`
      );
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setIsSuccess(false);
      setMessage(
        err.response?.data?.error ||
          (lang === 'ja' ? '登録に失敗しました。' : 'Registration failed.')
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        {lang === 'ja' ? '新規登録' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          name="username"
          placeholder={lang === 'ja' ? 'ユーザー名' : 'Username'}
          onChange={handleChange}
        />
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
          {lang === 'ja' ? '登録' : 'Register'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center text-sm ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterPage;

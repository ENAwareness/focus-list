import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      localStorage.setItem('user', JSON.stringify({ email: form.email }));
      setMessage(`✅ Welcome back, ${res.data.username || 'User'}!`);
      window.location.href = '/';
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed.');
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        />
        <input
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          type="submit">
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default LoginPage;

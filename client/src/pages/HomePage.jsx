import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PomodoroTimer from '../components/PomodoroTimer';
import axiosInstance from '../utils/axiosInstance';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  //获取任务列表
  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axiosInstance.get('/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    }
  };

  //初始化加载
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTodos();
    }
  }, [navigate]);

  //提交新任务
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axiosInstance.post('/todos', { title });
      setTitle('');
      fetchTodos(); //重新加载任务列表
    } catch (err) {
      console.error('Failed to add todo', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axiosInstance.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axiosInstance.patch(`/todos/${id}`);
      fetchTodos(); //更新列表
    } catch (err) {
      console.error('Toggle error', err);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-start md:items-start gap-8 mt-10 max-w-4xl mx-auto">
        {/* 为 PomodoroTimer 的容器设置固定宽度，防止语言切换时布局抖动 */}
        {/* w-96 (24rem) 与 PomodoroTimer 内部的 max-w-sm (24rem) 匹配 */}
        {/* flex-shrink-0 防止该列在 flex 布局中被压缩 */}
        <div className="w-full md:w-96 md:flex-shrink-0">
          <PomodoroTimer />
        </div>
        <div className="flex-grow bg-white p-8 rounded-lg shadow-lg">
          <h2 className="flex items-center text-xl font-semibold text-gray-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            {lang === 'ja' ? 'フォーカスリスト' : 'FOCUS LIST'}
          </h2>
          <form onSubmit={handleAddTodo} className="flex gap-1 mb-4 sm:gap-2">
            <input
              type="text"
              placeholder={lang === 'ja' ? '新しいタスクを追加...' : 'Add a new task...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="50"
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 sm:px-3 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap"
              disabled={!title.trim()}>
              {lang === 'ja' ? '追加' : 'Add'}
            </button>
          </form>
          <ul className="space-y-1">
            {todos.length === 0 ? (
              <p className="text-gray-500">
                {lang === 'ja' ? 'タスクはまだありません。' : 'No tasks yet.'}
              </p>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 group">
                  <span
                    onClick={() => handleToggle(todo._id)}
                    className={`flex-grow cursor-pointer ${
                      todo.done ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}>
                    {todo.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(todo._id);
                    }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;

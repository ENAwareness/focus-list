import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PomodoroTimer from '../components/PomodoroTimer';
import axiosInstance from '../utils/axiosInstance';

const HomePage = () => {
  const navigate = useNavigate();

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
        <div className="w-full md:w-64">
          {' '}
          <PomodoroTimer />
        </div>
        <div className="flex-grow max-w-xl px-4">
          {' '}
          <h2 className="text-2xl font-bold mb-4">📝 My Focus List</h2>
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter a task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow border rounded px-3 py-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </form>
          <ul className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-gray-500">No tasks yet.</p>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo._id}
                  onClick={() => handleToggle(todo._id)}
                  className={`flex justify-between items-center px-4 py-2 border rounded cursor-pointer ${
                    todo.done ? 'line-through text-gray-400' : ''
                  }`}>
                  <span>{todo.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(todo._id);
                    }}
                    className="text-red-500 hover:text-red-700">
                    ❌
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

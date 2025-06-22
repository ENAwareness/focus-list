import { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  //获取任务列表
  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    }
  };

  //初始化加载
  useEffect(() => {
    fetchTodos();
  }, []);

  //提交新任务
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/todos', { title });
      setTitle('');
      fetchTodos(); //重新加载任务列表
    } catch (err) {
      console.error('Failed to add todo', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  return (
    <div>
      <h2>Focus List</h2>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Enter a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.title}
            <button onClick={() => handleDelete(todo._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;

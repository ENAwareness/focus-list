import { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    //预留一个后端请求接口
    const fetchTodos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/todos'); //接口之后实现
        setTodos(res.data);
      } catch (err) {
        console.error('Failed to fetch todos', err);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h2>Focus list</h2>
      {todos.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;

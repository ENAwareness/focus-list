import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import todoRoutes from '../routes/todoRoutes.js';

// Mock the Todo model
const mockTodo = {
  find: jest.fn(),
  findById: jest.fn(),
  prototype: {
    save: jest.fn(),
    deleteOne: jest.fn()
  }
};

// Mock Todo constructor
const TodoConstructor = jest.fn().mockImplementation((data) => ({
  ...data,
  save: jest.fn(),
  deleteOne: jest.fn()
}));

// Mock the auth middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = { _id: 'test-user-id' };
  next();
};

// Create Express app for testing
const createApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock the protect middleware
  jest.doMock('../middleware/authMiddleware.js', () => ({
    protect: mockAuthMiddleware
  }));
  
  // Mock the Todo model
  jest.doMock('../models/Todo.js', () => ({
    default: Object.assign(TodoConstructor, mockTodo)
  }));
  
  app.use('/api/todos', todoRoutes);
  return app;
};

describe('Todo Routes', () => {
  let app;
  
  beforeEach(() => {
    jest.clearAllMocks();
    app = createApp();
  });

  describe('GET /api/todos', () => {
    test('should return user todos', async () => {
      const mockTodos = [
        { _id: '1', title: 'Test Todo 1', done: false, user: 'test-user-id' },
        { _id: '2', title: 'Test Todo 2', done: true, user: 'test-user-id' }
      ];

      mockTodo.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTodos)
      });

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toEqual(mockTodos);
      expect(mockTodo.find).toHaveBeenCalledWith({ user: 'test-user-id' });
    });

    test('should handle server error', async () => {
      mockTodo.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app)
        .get('/api/todos')
        .expect(500);

      expect(response.body).toEqual({ error: 'Server error.' });
    });
  });

  describe('POST /api/todos', () => {
    test('should create new todo', async () => {
      const newTodoData = { title: 'New Todo' };
      const savedTodo = { 
        _id: 'new-id', 
        title: 'New Todo', 
        done: false, 
        user: 'test-user-id' 
      };

      const mockSave = jest.fn().mockResolvedValue(savedTodo);
      TodoConstructor.mockImplementation(() => ({
        save: mockSave
      }));

      const response = await request(app)
        .post('/api/todos')
        .send(newTodoData)
        .expect(201);

      expect(response.body).toEqual(savedTodo);
      expect(TodoConstructor).toHaveBeenCalledWith({
        title: 'New Todo',
        user: 'test-user-id'
      });
    });

    test('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);

      expect(response.body).toEqual({ error: 'Title is required.' });
    });

    test('should handle creation error', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('Save error'));
      TodoConstructor.mockImplementation(() => ({
        save: mockSave
      }));

      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo' })
        .expect(500);

      expect(response.body).toEqual({ error: 'Server error.' });
    });
  });

  describe('DELETE /api/todos/:id', () => {
    test('should delete todo successfully', async () => {
      const mockTodoInstance = {
        _id: 'todo-id',
        user: { toString: () => 'test-user-id' },
        deleteOne: jest.fn().mockResolvedValue()
      };

      mockTodo.findById.mockResolvedValue(mockTodoInstance);

      const response = await request(app)
        .delete('/api/todos/todo-id')
        .expect(200);

      expect(response.body).toEqual({ message: 'Todo deleted.' });
      expect(mockTodo.findById).toHaveBeenCalledWith('todo-id');
      expect(mockTodoInstance.deleteOne).toHaveBeenCalled();
    });

    test('should return 404 if todo not found', async () => {
      mockTodo.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/todos/nonexistent-id')
        .expect(404);

      expect(response.body).toEqual({ error: 'Todo not found.' });
    });

    test('should return 401 if user not authorized', async () => {
      const mockTodoInstance = {
        _id: 'todo-id',
        user: { toString: () => 'other-user-id' },
        deleteOne: jest.fn()
      };

      mockTodo.findById.mockResolvedValue(mockTodoInstance);

      const response = await request(app)
        .delete('/api/todos/todo-id')
        .expect(401);

      expect(response.body).toEqual({ error: 'Not authorized to delete this todo.' });
      expect(mockTodoInstance.deleteOne).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /api/todos/:id', () => {
    test('should toggle todo status', async () => {
      const mockTodoInstance = {
        _id: 'todo-id',
        done: false,
        user: { toString: () => 'test-user-id' },
        save: jest.fn().mockResolvedValue({ _id: 'todo-id', done: true })
      };

      mockTodo.findById.mockResolvedValue(mockTodoInstance);

      const response = await request(app)
        .patch('/api/todos/todo-id')
        .expect(200);

      expect(mockTodoInstance.done).toBe(true);
      expect(mockTodoInstance.save).toHaveBeenCalled();
      expect(response.body).toEqual({ _id: 'todo-id', done: true });
    });

    test('should return 404 if todo not found', async () => {
      mockTodo.findById.mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/todos/nonexistent-id')
        .expect(404);

      expect(response.body).toEqual({ error: 'Todo not found.' });
    });

    test('should return 401 if user not authorized', async () => {
      const mockTodoInstance = {
        _id: 'todo-id',
        done: false,
        user: { toString: () => 'other-user-id' },
        save: jest.fn()
      };

      mockTodo.findById.mockResolvedValue(mockTodoInstance);

      const response = await request(app)
        .patch('/api/todos/todo-id')
        .expect(401);

      expect(response.body).toEqual({ error: 'Not authorized to update this todo.' });
      expect(mockTodoInstance.save).not.toHaveBeenCalled();
    });
  });
});
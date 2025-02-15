import { useEffect, useState } from 'react';
import { getToDos, saveToDos } from '@/services/ToDoList';

export default () => {
	const [todos, setTodos] = useState<ToDoList.ToDoItem[]>([]);

	// Load todos from localStorage on component mount
	useEffect(() => {
		setTodos(getToDos());
	}, []);

	// Save todos to localStorage whenever the todos state changes
	useEffect(() => {
		saveToDos(todos);
	}, [todos]);

	// Add a new todo
	const addTodo = (title: string, category: string, color: string) => {
		const newTodo: ToDoList.ToDoItem = {
			id: Date.now().toString(),
			title,
			category,
			color,
		};
		setTodos((prevTodos) => [...prevTodos, newTodo]);
	};

	// Edit an existing todo
	const editTodo = (id: string, updatedTodo: Partial<ToDoList.ToDoItem>) => {
		setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo)));
	};

	// Delete a todo
	const deleteTodo = (id: string) => {
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
	};

	return {
		todos,
		addTodo,
		editTodo,
		deleteTodo,
	};
};

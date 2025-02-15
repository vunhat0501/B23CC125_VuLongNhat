export const getToDos = () => {
	const todos = localStorage.getItem('todos');
	return todos ? JSON.parse(todos) : [];
};

export const saveToDos = (todos: ToDoList.ToDoItem[]) => {
	localStorage.setItem('todos', JSON.stringify(todos));
};

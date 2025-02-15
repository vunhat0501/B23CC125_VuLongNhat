import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useModel } from 'umi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Function to generate random colors
const getRandomColor = () => {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	return `rgb(${r}, ${g}, ${b})`;
};

const ToDoList: React.FC = () => {
	const { todos, addTodo, editTodo, deleteTodo } = useModel('todolist');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTodo, setEditingTodo] = useState<ToDoList.ToDoItem | null>(null);
	const [form] = Form.useForm();

	const handleAddTodo = () => {
		setIsModalVisible(true);
		form.resetFields();
		setEditingTodo(null);
	};

	const handleEditTodo = (todo: ToDoList.ToDoItem) => {
		setIsModalVisible(true);
		form.setFieldsValue(todo);
		setEditingTodo(todo);
	};

	const handleDeleteTodo = (id: string) => {
		deleteTodo(id);
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			if (editingTodo) {
				editTodo(editingTodo.id, values);
			} else {
				addTodo(values.title, values.category, getRandomColor()); // Assign random color
			}
			setIsModalVisible(false);
			form.resetFields();
		});
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	return (
		<div style={{ textAlign: 'center' }}>
			<div style={{ textAlign: 'center' }}>
				<h1 style={{ fontSize: '40px', marginBottom: '20px' }}>Todo List</h1>

				<Button
					onClick={handleAddTodo}
					style={{
						marginBottom: '30px',
						padding: '3px 30px 30px 30px',
						verticalAlign: 'middle',
						color: 'white',
						backgroundColor: 'blue',
						borderRadius: '10px',
						fontSize: '16px',
					}}
				>
					Create Task
				</Button>
			</div>

			<div style={{ backgroundColor: '#faf7f7' }}>
				{/* Task Grid */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
						gap: '20px',
						justifyContent: 'center',
						padding: '20px',
					}}
				>
					{todos.map((todo) => {
						const addTransparency = (color: string, alpha: number = 0.2) => {
							if (color.startsWith('#')) {
								// Convert HEX to RGBA
								const hex = color.replace('#', '');
								const bigint = parseInt(hex, 16);
								const r = (bigint >> 16) & 255;
								const g = (bigint >> 8) & 255;
								const b = bigint & 255;
								return `rgba(${r}, ${g}, ${b}, ${alpha})`;
							} else if (color.startsWith('rgb')) {
								// Convert existing RGB(A) to RGBA
								return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
							} else if (color.startsWith('hsl')) {
								// Convert existing HSL to HSLA
								return color.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
							}
							return color; // Return original if unknown format
						};
						return (
							<div
								key={todo.id}
								style={{
									backgroundColor: '#fff',
									borderTop: `6px solid ${todo.color}`,
									borderRadius: '10px',
									boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
									padding: '15px',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'flex-start',
									position: 'relative',
									height: '200px',
								}}
							>
								{/* Category */}
								<div
									style={{
										backgroundColor: addTransparency(todo.color, 0.2),
										padding: '5px 10px',
										borderRadius: '5px',
										fontWeight: 'bold',
										color: '#333',
										marginBottom: '10px',
									}}
								>
									{todo.category}
								</div>

								{/* Task Title */}
								<p
									style={{
										flex: 1,
										fontSize: '16px',
										marginBottom: '10px',
										color: '#333',
										padding: '5px 10px',
									}}
								>
									{todo.title}
								</p>

								{/* Actions: Edit & Delete */}
								<div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end' }}>
									<EditOutlined
										style={{ fontSize: '18px', color: todo.color, cursor: 'pointer' }}
										onClick={() => handleEditTodo(todo)}
									/>
									<DeleteOutlined
										style={{ fontSize: '18px', color: todo.color, cursor: 'pointer' }}
										onClick={() => handleDeleteTodo(todo.id)}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Modal for Adding/Editing */}
			<Modal
				title={editingTodo ? 'Edit Task' : 'Add Task'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
			>
				<Form form={form}>
					<Form.Item label='Title' name='title' rules={[{ required: true, message: 'Please enter the title!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label='Category'
						name='category'
						rules={[{ required: true, message: 'Please enter the category!' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ToDoList;

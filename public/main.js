//const url = 'https://ill-pink-mite-veil.cyclic.app'
const url = 'https://cyclictl.cyclic.app';
const logout = document.querySelector('.logout');
const sortCategory = document.getElementById('order-category');
const sortDate = document.getElementById('sort-recent');
const delUser = document.querySelector('.del-user')

delUser.addEventListener('click', async () => {
	const getUser = await fetch(`${url}/tasks`, {
		method: 'GET'
	});

	const user = await getUser.json();

	await fetch(`${url}/delete-user/${user[0].owner}`, {
		method: 'DELETE'
	});

	alert('Sorry to see you go! You account was successfuly deleted.');
	location.href = '/';
})

sortCategory.addEventListener('click', async () => {
	let res = await fetch(`${url}/tasks`, {
		method: 'GET'
	})

	const todos = await res.json();

	todos.sort((a, b) => (b.category > a.category) ? 1 : -1)

	renderTasks(todos);

});

sortDate.addEventListener('click', async () => {
	let res = await fetch(`${url}/tasks`, {
		method: 'GET'
	})

	const todos = await res.json();

	todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	renderTasks(todos);
})

const Logout = async () => {
	let result = await fetch(`${url}/logout`, {
		method: 'GET'
	})

	const data = await result.json();
	alert(data.message);

	location.href = '/';
}

logout.addEventListener('click', Logout);

const renderTasks = (todos) => {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	//todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	todos.sort((a, b) => a.completed - b.completed);

	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.completed;

		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		edit.setAttribute('value', todo._id);
		deleteButton.classList.add('delete');
		deleteButton.setAttribute('value', todo._id);

		let stringToShow = `${todo.description}`
		content.innerHTML = `<input type="text" class="inpts" value="${stringToShow}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		if (todo.completed) {
			todoItem.classList.add('done');
		}

		input.addEventListener('change', async (e) => {
			todo.completed = e.target.checked;
			//localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.completed) {
				todoItem.classList.add('done');
				//console.log(todo._id);
				const res = await fetch(`${url}/update-task`, {
					method: 'PATCH',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						id: todo._id,
						description: todo.description,
						completed: true
					})
				})

				const completed = await res.json();
				//console.log(completed.message);

			} else {
				todoItem.classList.remove('done');

				const res = await fetch(`${url}/update-task`, {
					method: 'PATCH',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						id: todo._id,
						description: todo.description,
						completed: false
					})
				})

				const completed = await res.json();
				//console.log(completed.message);
			}

			getTasks();

		})

		edit.addEventListener('click', (e) => {

			const input = content.querySelector('input');
			edit.innerHTML = "Save";
			edit.setAttribute('id', 'save-items');
			const saveItems = todoList.querySelector('#save-items');
			saveItems.setAttribute('value', todo._id);
			input.removeAttribute('readonly');

			saveItems.addEventListener('click', async (e) => {
				input.setAttribute('readonly', true);
				todo.description = input.value;

				const res = await fetch(`${url}/update-task`, {
					method: 'PATCH',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						id: todo._id,
						description: todo.description,
						completed: false
					})
				})
				const updated = await res.json();
				//console.log(updated.message);

				getTasks();
				//localStorage.setItem('todos', JSON.stringify(todos));
				//DisplayTodos()
			})

			input.focus();
		})

		deleteButton.addEventListener('click', async (e) => {

			const delRequest = await fetch(`${url}/delete-task/${todo._id}`, {
				method: 'DELETE',
			})

			const deleted = await delRequest.json();
			//console.log(`Deleted task: ${deleted.description}`);

			await getTasks();
		})
	})
}

const getTasks = async () => {
	let res = await fetch(`${url}/tasks`, {
		method: 'GET'
	})

	const todos = await res.json();

	renderTasks(todos);
}

getTasks();

const newTodoForm = document.querySelector('#new-todo-form');
const addBtn = document.querySelector('#add-btn');
const todoInput = document.querySelector('#content');

const nameInput = document.querySelector('#name');
const getUser = async () => {
	const fetchUser = await fetch(`${url}/loggedUser`, {
		method: 'GET',
	});

	const username = await fetchUser.json()

	nameInput.value = username.username;
}
getUser();

addBtn.addEventListener('click', async (e) => {
	e.preventDefault();

	todo = {
		description: todoInput.value,
		category: "",
	}

	if (todo.content === "") {
		alert("Please add an input and select the corresponding category");
		return;
	}

	const persCat = document.getElementById('category2');
	const busiCat = document.getElementById('category1');

	if (!persCat.checked && !busiCat.checked) {
		alert("You need to select one category");
		return;
	}

	if (persCat.checked) {
		todo.category = 'personal';
	} else {
		todo.category = 'business';
	}

	const sendData = async () => {
		try {
			const clientReq = await fetch(`${url}/task`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(todo)
			});

			await clientReq.json();

			await getTasks();
		} catch (err) {
			alert('Something went wrong', err);
		}
	}

	sendData();

	todoInput.value = "";
	persCat.checked = false;
	busiCat.checked = false;

	await getTasks();
})

const speakBtn = document.querySelector('.speak');

speakBtn.addEventListener('click', async (e) => {
	e.preventDefault();
	window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	let res = await fetch(`${url}/tasks`, {
		method: 'GET'
	})

	const todos = await res.json();

	const todoItem = document.querySelector('.todo-item');

	const recognition = new SpeechRecognition();
	recognition.interimResults = false;
	recognition.lang = 'pt-Br'
	//recognition.lang = 'en-Us'

	recognition.addEventListener('result', async (e) => {
		const transcript = Array.from(e.results)
			.map(result => result[0])
			.map(result => result.transcript)
			.join('');

		if (e.results[0].isFinal) {
			todoInput.value = transcript;
		}

		if (transcript.startsWith("marcar")) {
			const reducedTransc = transcript.slice(6);
			const trimTransc = reducedTransc.trim();

			todos.forEach(todo => {
				if (todo.description == trimTransc) {

					todoItem.classList.add('done')
					const res = fetch(`${url}/update-task`, {
						method: 'PATCH',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({
							id: todo._id,
							description: todo.description,
							completed: true
						})
					})

					todoInput.value = "";

					getTasks()
				}
			})
		} else if (transcript.startsWith("criar pessoal")) {
			document.getElementById('category2').checked = true;

			const reducedTransc = transcript.slice(13);
			const trimTransc = reducedTransc.trim();
			todoInput.value = trimTransc;

			newTodoForm.addEventListener('change', () => {
				todo = { description: todoInput.value, category: "personal", completed: false };
			});

			getTasks();

		} else if (transcript.startsWith("criar trabalho")) {
			document.getElementById('category1').checked = true;

			const reducedTransc = transcript.slice(14);
			const trimTransc = reducedTransc.trim();

			todoInput.value = trimTransc;

			newTodoForm.addEventListener('change', () => {
				todo = { description: todoInput.value, category: "business", completed: false };
			});

			getTasks();
		}
	});
	recognition.start();
});

getTasks()

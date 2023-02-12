const tasks = document.querySelector('.tasks');
const logout = document.querySelector('.logout');

const url = 'http://localhost:3000/'


const RenderTasks = async () => {
  const jsonBody = {};
  jsonBody.message = 'Hello from POST'

  let result = await fetch(`${url}dashboard`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonBody)
  });
  //console.log(jsonBody);
  const data = await result.json();

  const container = document.querySelector('.container');
  tasks.innerHTML = '';

  data.forEach(task => {
    // tasks.insertAdjacentHTML('beforeend', `<div class="todo">${task.taskName} is completed? ${task.completed}<button class="complete-task" value="${task._id}">Mark Complete</button><button class="del-task" value="${task._id}">Delete</button></div>`);
    const todoDiv = document.createElement('div');
    const taskDiv = document.createElement('div');
    const delBtn = document.createElement('button');
    const markcomplete = document.createElement('button');
    delBtn.innerHTML = 'Delete';
    delBtn.setAttribute('value', `${task._id}`);
    markcomplete.innerHTML = 'Mark Complete';
    markcomplete.setAttribute('value', `${task._id}`);
    taskDiv.innerHTML = `${task.taskName} is completed? ${task.completed}`;
    taskDiv.append(markcomplete);
    taskDiv.append(delBtn);
    todoDiv.append(taskDiv)
    tasks.append(todoDiv);

    delBtn.addEventListener('click', async (e) => {
      const jsonBody = {};
      jsonBody.id = e.target.value;

      let deleteTask = await fetch(`${url}task-delete`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(jsonBody)
      })

      const data = await deleteTask.json();
      alert(data.message);

      RenderTasks();
    });

    markcomplete.addEventListener('click', async (e) => {
      const jsonBody = {};
      jsonBody.id = e.target.value;

      let result = await fetch(`${url}mark-complete`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(jsonBody)
      });

      const data = await result.json();
      alert(data.message);

      RenderTasks();
    })
  });

  // container.addEventListener('click', async (e) => {
  //   e.preventDefault();
  //   //console.log(e.target.value);
  //   //apanhar o nome da Task através do e.target
  //   //enviar o nome ou o id em req.body para a route
  //   //na route, findOneAndDelete com o nome ou id
  //   //enviar resposta { message: ok } da route para o html
  //   //chamar RenderTasks()
  //   const jsonBody = {};
  //   jsonBody.id = e.target.value;

  //   let deleteTask = await fetch(`${url}task-delete`, {
  //     method: 'DELETE',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify(jsonBody)
  //   })

  //   const data = await deleteTask.json();
  //   alert(data.message);

  //   RenderTasks();

  // })

}

RenderTasks();

const Logout = async () => {
  let result = await fetch(`${url}logout`, {
    method: 'GET'
  })

  const data = await result.json();
  alert(data.message);

  location.href = '/';
}

logout.addEventListener('click', Logout);
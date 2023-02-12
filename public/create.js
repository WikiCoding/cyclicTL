const addTask = document.querySelector('.add-task');
const input = document.querySelector('.task-name');

const url = 'http://localhost:3000/';

addTask.addEventListener('click', async (e) => {
  e.preventDefault();

  const jsonBody = {};
  jsonBody.task = input.value;
  console.log(jsonBody);
  let result = await fetch(`${url}create`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonBody)
  });

  const taskData = await result.json();
  console.log(taskData, 'from task data');

  location.href = '/todos'
})
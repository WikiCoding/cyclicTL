const express = require('express');
const app = express();
require('./db/mongoose')
const User = require('./models/userModel');
const Task = require('./models/taskModel');
const auth = require('../src/middleware/auth');
const path = require('path');
const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../public/views');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//render html to the browser
app.get('/', (req, res) => {
  if (req.user) {
    res.status(200).send(req.user);
  }
  else {
    res.status(200).send();
  }
})

app.get('/todos', auth, async (req, res) => {
  if (req.user !== 'No user') {
    res.sendFile(`${publicPath}/todos.html`)
  } else {
    //res.send({ message: 'Please login or signup!' })
    res.sendFile(`${publicPath}/`)
  }
})

app.get('/login', (req, res) => {
  const token = req.cookies['auth_token'];
  if (token) {
    res.sendFile(`${publicPath}/todos.html`)
  } else {
    res.sendFile(`${publicPath}/login.html`)
  }
});

app.get('/signup', (req, res) => {
  res.sendFile(`${publicPath}/signup.html`)
});

app.get('/loggedUser', auth, (req, res) => {
  res.status(200).send(req.user)
})

//////////////////////////////////////////////////////

app.post('/login', async (req, res) => {
  // getting the email, pw and login request from the client at req.body
  // connect to the db and find the corresponding user (if any), done with findByCredentials created function
  // if found, generate a fresh token
  // save the token to the cookies to be used later at all private operations that require auth
  // finally send status 200 or sendFile Dashboard.html...
  try {
    const user = await User.findByCredentials(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    //console.log(token);
    res.cookie('auth_token', token);
    res.status(200).send({
      message: 'Ok',
      id: user._id.toString()
    });
  } catch (e) {
    res.status(400).send();
  }
});

app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  const token = await user.generateAuthToken();

  try {
    await user.save();

    res.cookie('auth_token', token);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send()
  }
});

app.get('/logout', auth, async (req, res) => {
  try {
    res.clearCookie('auth_token').send({ message: 'logged out' })
  } catch (e) {
    res.status(500).send()
  }
})

app.get('/tasks', auth, async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id });

  res.status(200).send(tasks);
})

app.post('/task', auth, async (req, res) => {
  const task = new Task({
    description: req.body.description,
    category: req.body.category,
    owner: req.user._id
  })

  await task.save();

  res.status(201).send({ message: 'Task added' })
})

app.patch('/update-task', auth, async (req, res) => {
  try {
    const updateTask = await Task.findOne({ _id: req.body.id });

    updateTask.description = req.body.description;
    updateTask.completed = req.body.completed;
    await updateTask.save()

    res.status(200).send({ message: 'Updated' });
  } catch (e) {
    res.status(400).send(e)
  }
})

app.delete('/delete-task/:id', auth, async (req, res) => {
  try {
    const deleteTask = await Task.findOneAndDelete({ _id: req.params.id });
    res.status(200).send(deleteTask)
  } catch (e) {
    res.status(404).send()
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
})
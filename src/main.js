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
const jwt = require('jsonwebtoken');
const { findOne } = require('./models/taskModel');

app.use(express.json());
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//render html to the browser

app.get('/todos', auth, async (req, res) => {
  try {
    if (req.user) {
      res.sendFile(`${publicPath}/todos.html`)
    }
  } catch (e) {
    res.send({ message: 'Problem with your request' })
  }

})

app.get('/login', async (req, res) => {
  try {
    res.sendFile(`${publicPath}/login.html`)
  } catch (e) {
    res.sendFile(`${publicPath}/login.html`)
  }
});

app.get('/signup', (req, res) => {
  res.sendFile(`${publicPath}/signup.html`)
});

app.get('/loggedUser', auth, async (req, res) => {
  try {
    res.status(200).send(req.user)
  } catch (e) {
    res.status(500).send({ message: 'not logged' })
  }
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

    res.cookie('auth_token', token);
    res.status(200).send({
      message: 'Ok',
      id: user._id.toString(),
      token
    });
  } catch (e) {
    res.status(400).send();
  }
});

app.post('/signup', async (req, res) => {
  const validateUniqueUsername = await User.find({ username: req.body.username })

  if (validateUniqueUsername.length > 0) {
    return res.status(400).send({ message: 'Username is already in use!' });
  }

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

app.delete('/delete-user/:id', auth, async (req, res) => {
  try {
    const deleteUser = await User.findOneAndDelete({ _id: req.params.id });
    await deleteUser.remove();
    res.status(200).send(deleteUser)
  } catch (e) {
    res.status(404).send()
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
})

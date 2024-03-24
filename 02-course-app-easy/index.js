const express = require('express');
const app = express();
const bodyParser =require ('body-parser');

app.use(bodyParser.json());
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  // username and password is sent through body
  var newAdmin = {};
  newAdmin.username = req.body.username;
  newAdmin.password = req.body.password;
  ADMINS.push(newAdmin);

  res.status(200).json({message:'Admin created successfully' });


});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var username = req.headers.username;
  var password = req.headers.password;

  var adminExists = ADMINS.find((obj)=>obj.username===username && obj.password===password);
  if(adminExists){
    res.status(200).json({message:'Logged in successfully'});

  }else{
    res.status(400).json({message:'Wrong username or password'});
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  var username = req.headers.username;
  var password = req.headers.password;

  var adminExists = ADMINS.find((obj)=>obj.username===username && obj.password===password);
  if(adminExists){
    var newCourse = {};
    newCourse.title = req.body.title;
    newCourse.description = req.body.description;
    newCourse.price = req.body.price;
    newCourse.imageLink= req.body.imageLink;
    newCourse.published = req.body.published;
    newCourse.courseId = Math.floor(Math.random() * 1000) + 1;
    COURSES.push(newCourse);

    res.status(200).json({message:'Course created successfully',courseId:newCourse.courseId});
  }else{
    res.status(400).json({message:'Wrong username or password'});
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  var username = req.headers.username;
  var password = req.headers.password;

  var adminExists = ADMINS.find((obj)=>obj.username===username && obj.password===password);
  
  if(adminExists){
    res.status(200).json({courses:COURSES});
  }else{
    res.status(400).json({message:'Wrong username or password'});
  }

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

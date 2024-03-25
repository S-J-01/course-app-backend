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
  var username = req.headers.username;
  var password = req.headers.password;

  var adminExists = ADMINS.find((obj)=>obj.username===username && obj.password===password);
  if(adminExists){
    var courseId = req.params.courseId;
    var courseToUpdate = COURSES.find((obj)=>obj.courseId===courseId);
    if(courseToUpdate){
    courseToUpdate.title=req.body.title;
    courseToUpdate.description=req.body.description;
    courseToUpdate.price = req.body.price;
    courseToUpdate.imageLink=req.body.imageLink;
    courseToUpdate.published=req.body.published;

    res.status(200).json({message:'course updated successfully'});
    }else{
      res.status(400).json({message:'wrong course id'});
    }
  }else{
    res.status(400).json({message:'wrong username or password'});
  }
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
  var newUser = {};
  newUser.username=req.body.username;
  newUser.password=req.body.password;
  newUser.purchasedCourses = [];
  USERS.push(newUser);

  res.status(200).json({message:'User created successfully'});
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var username= req.headers.username;
  var password = req.headers.password;

  var userExists= USERS.find((obj)=>obj.username===username && obj.password===password);
  if(userExists){
    res.status(200).json({message:'logged in successfully'});
  }else{
    res.status(400).json({message:'wrong username or passsword'});
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  var username= req.headers.username;
  var password = req.headers.passsword;

  var userExists= USERS.find((obj)=>obj.username===username&&obj.password===password);
  if(userExists){
    res.status(200).json({courses:COURSES});
  }else{
    res.status(400).json({message:'wrong username or password'});
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var username= req.headers.username;
  var password = req.headers.password;
  var courseIdToBePurchased = req.params.courseId;
  var userExists= USERS.find((obj)=>obj.username===username&&obj.password===password);
  if(userExists){
    var courseToBePurchased = COURSES.find((obj)=>obj.courseId===courseIdToBePurchased);
    if(courseToBePurchased){
      userExists.purchasedCourses.push(courseToBePurchased);
      res.status(200).json({message:'course purchased successfully'});
    }else{
      res.status(400).json({message:'wrong course ID'});
    }
  }else{
    res.status(400).json({message:'wrong username or password'});
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var username= req.headers.username;
  var password = req.headers.passsword;

  var userExists= USERS.find((obj)=>obj.username===username&&obj.password===password);

  if(userExists){
    res.status(200).json({purchasedCourses:userExists.purchasedCourses});
  }else{
    res.status(400).json({message:'wrong username or password'});
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(express.json());

var adminAuthentication = (req, res, next) => {
  var username = req.headers.username;
  var password  = req.headers.password;

  var admin = ADMINS.find(obj => obj.username === username && obj.password === password);
  if (admin) {
    req.admin=admin;
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};

var authenticateAdminJwtToken = (req,res,next)=>{
  var authHeader = req.headers.authorization;
  var token = authHeader && authHeader.split(' ')[1];
  if(token){
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,admin)=>{
   if (err) {
     res.status(403).json({message:'invalid token'});
   }else{
     req.admin=admin;
     next();
   }
  });
 }else{
   res.status(401).json({message:'authHeader empty'});
 }
 };
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
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

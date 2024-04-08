const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/courseAppDatabase');
require('dotenv').config();
app.use(express.json());
const ADMIN = require('./admin');
const COURSE = require ('./course');

var adminAuthentication = (req, res, next) => {
  var username = req.headers.username;
  var password  = req.headers.password;

  // var admin = ADMINS.find(obj => obj.username === username && obj.password === password);
  // if (admin) {
  //   req.admin=admin;
  //   next();
  // } else {
  //   res.status(403).json({ message: 'Admin authentication failed' });
  // }
  ADMIN.findOne({username:username, password:password})
  .then((admin)=>{
    if(admin){
      console.log('admin found in database while logging in');
      req.admin=admin;
      next();

    }else{
      res.status(403).json({message:'Admin authentication failed'});
    }
  })
  .catch(error =>{
    console.error(error);
  })
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
  const newAdmin = new ADMIN({
   username : req.body.username,
   password : req.body.password
  });

  newAdmin.save().then(resp=>{
    console.log('newly signed up admin saved to DB',resp);
  })

  var accessToken = jwt.sign(newAdmin,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
  res.status(200).json({message:'admin signed up successfully',token:accessToken});
});

app.post('/admin/login',adminAuthentication, (req, res) => {
  // logic to log in admin
  var admin = req.admin;
  var accessToken = jwt.sign(admin,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
  res.status(200).json({message:'admin login successful', token:accessToken});
});

app.post('/admin/courses',authenticateAdminJwtToken, (req, res) => {
  // logic to create a course
  const newCourse = new COURSE({
    title : req.body.title,
    description:req.body.description,
    price:req.body.price,
    imageLink:req.body.imageLink,
    published:req.body.published,
    courseID:Math.floor(Math.random() * 1000) + 1
  });
  newCourse.save().then(resp=>{
    console.log('new course saved to DB',resp);
  })
  res.status(200).json({message:'course created successfully', courseID:newCourse.courseID});
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

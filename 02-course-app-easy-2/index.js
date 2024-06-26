const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();


app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

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

var userAuthentication = (req, res, next) => {
  var username = req.headers.username;
  var password  = req.headers.password;
  var user = USERS.find(obj => obj.username === username && obj.password === password);
  if (user) {
    req.user = user;  
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
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

var authenticateUserJwtToken = (req,res,next)=>{
  var authHeader = req.headers.authorization;
  var token = authHeader && authHeader.split(' ')[1];
  if(token){
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
      if(err){
        res.status(403).json({message:'invalid token'});
      }else{
        req.user=user;
        next();
      }
    });
  }else{
    res.status(401).json({message:'authorization header empty'});
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var newAdmin={};
  newAdmin.username=req.body.username;
  newAdmin.password=req.body.password;
  ADMINS.push(newAdmin);

  var accessToken = jwt.sign(newAdmin,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
  res.status(200).json({message:'signup successful',token:accessToken});

});

app.post('/admin/login',adminAuthentication, (req, res) => {
  
  var admin = req.admin;
  var accessToken = jwt.sign(admin,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
  res.status(200).json({message:'logged in successfully',token:accessToken});
});

app.post('/admin/courses',authenticateAdminJwtToken, (req, res) => {
  // logic to create a course
  var newCourse = {};
    newCourse.title = req.body.title;
    newCourse.description = req.body.description;
    newCourse.price = req.body.price;
    newCourse.imageLink= req.body.imageLink;
    newCourse.published = req.body.published;
    newCourse.courseId = Math.floor(Math.random() * 1000) + 1;
    COURSES.push(newCourse);

    res.status(200).json({message:'Course created successfully',courseId:newCourse.courseId});

});

app.put('/admin/courses/:courseId',authenticateAdminJwtToken, (req, res) => {
  // logic to edit a course
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
  
});

app.get('/admin/courses',authenticateAdminJwtToken, (req, res) => {
  // logic to get all courses
  res.status(200).json({courses:COURSES});

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var newUser = {};
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.purchasedCourses = [];
  USERS.push(newUser);

  var accessToken = jwt.sign(newUser,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
  res.status(200).json({message:'User created successfully',token:accessToken});
});

app.post('/users/login',userAuthentication, (req, res) => {
  // logic to log in user
  var user = req.user;
  var accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
  res.status(200).json({message:'logged in successfully',token:accessToken});
});

app.get('/users/courses',authenticateUserJwtToken, (req, res) => {
  // logic to list all courses
  res.status(200).json({courses:COURSES});
});

app.post('/users/courses/:courseId',authenticateUserJwtToken, (req, res) => {
  // logic to purchase a course
  var courseId = req.params.courseId;
  var courseToPurchase = COURSES.find(obj=>obj.courseId===courseId);
  if(courseToPurchase){
    req.user.purchasedCourses.push(courseToPurchase);
    res.status(200).json({message:'course purchased successfully'});
  } else{
    res.status(400).json({message:'wrong course ID'});
  }

});

app.get('/users/purchasedCourses',authenticateUserJwtToken, (req, res) => {
  // logic to view purchased courses
  var purchasedCourses = req.user.purchasedCourses;
  res.status(200).json({purchasedCourses:purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

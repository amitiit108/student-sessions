module.exports = auth => {
    const student = require("../controller/authController");
  
    const router = require("express").Router();
  

    router.post("/register", student.register);
  
    router.post("/login", student.login);
  
    auth.use('/api/student', router); 
  };
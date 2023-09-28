module.exports = authDean => {
    const dean = require("../controller/authDeanController");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/register", dean.register);
  
    router.post("/login", dean.login);
  
    authDean.use('/api/dean', router); 
  };
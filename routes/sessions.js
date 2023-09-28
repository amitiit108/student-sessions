// routes/sessions.js

const express = require("express");
const router = express.Router();

module.exports = router;

module.exports = (sessions) => {
  const session = require("../controller/sessionController");

  const router = require("express").Router();

   router.get("/pending", session.pendingSessions);

   router.get("/free", session.freeSessions);

   router.post("/book", session.bookSession);

  sessions.use("/api/sessions", router);
};

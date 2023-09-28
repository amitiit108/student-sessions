const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const db = require("../database/models");
const Session = db.session;
const Booking = db.booking;
const Slot = db.slot;
const Op = db.Sequelize.Op;

exports.bookSession = async (req, res) => {
  try {
    // Extract the token from the request headers
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        // Token verification failed
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { sessionId } = req.body;
      const studentId = decoded.studentId;
      // Check if the requested session is available
      const session = await Session.findOne({
        where: { id: sessionId, status: "available" },
      });

      if (!session) {
        return res
          .status(404)
          .json({ message: "Session not found or already booked." });
      }

      // Create a booking record in the database
      const booking = await Booking.create({
        sessionId,
        studentId,
        status: "approved",
      });

      // Update the session's status to "booked"
      await session.update({ status: "booked" });

      return res
        .status(201)
        .json({ message: "Session booked successfully", booking });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.freeSessions = async (req, res) => {
  try {
    // Extract the token from the request headers
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        // Token verification failed
        return res.status(401).json({ message: "Unauthorized" });
      }

      const currentDate = new Date();

      // Query sessions that are free and match the current date and time
      const freeSessions = await Session.findAll({
        where: {
          status: "available", // Change this to match your data model
        },
        include: [
          {
            model: Slot,
            where: {
              startTime: {
                [Op.gt]: currentDate, // Slots starting in the future
              },
            },
          },
        ],
      });

      return res.status(200).json({
        message: "Free sessions retrieved successfully",
        sessions: freeSessions,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.pendingSessions = async (req, res) => {
  try {
    // Extract the token from the request headers
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        // Token verification failed
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Token is valid, continue with retrieving pending sessions
      const deanId = decoded.deanId; // Assuming you've encoded the dean's userId in the token

      // Retrieve pending sessions for the dean
      //   const pendingSessions = await Booking.findAll({
      //     where: { deanId, status: "pending" },
      //     include: [
      //       {
      //         model: Session,
      //         include: Student, // Include student details
      //       },
      //     ],
      //   });

      const pendingSessions = await Session.findAll({
        where: {
          deanId: deanId,
          status: "booked", // Change this to match your data model
        },
        include: [
          {
            model: Booking,
          },
        ],
      });

      return res.status(200).json({
        message: "Pending sessions retrieved successfully",
        sessions: pendingSessions,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

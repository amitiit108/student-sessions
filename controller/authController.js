const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const db = require("../database/models");
const Student = db.student;
const Token = db.token;
const Session = db.session;
const Slot = db.slot;
const Op = db.Sequelize.Op;

exports.register = async (req, res) => {
  try {
    const { universityId, password } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ where: { universityId } });

    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // Generate a random salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student record in the database
    const newStudent = await Student.create({
      universityId,
      password_hash: hashedPassword,
      password_salt: salt,
    });

    const response = {
      universityId: newStudent?.universityId,
    };

    return res
      .status(201)
      .json({ message: "Registration successful", student: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { universityId, password } = req.body;

    // Check if the student exists
    const student = await Student.findOne({ where: { universityId } });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Verify the provided password
    const passwordMatch = await bcrypt.compare(password, student.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a unique token using uuid
    const token = uuid.v4();

    // Create a new token record in the database
    await Token.create({
      studentId: student.id,
      token,
    });

    // Sign a JWT with the token
    const accessToken = jwt.sign(
      { token, studentId: student?.id, userType: "student" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res
      .status(200)
      .json({ message: "Token generated successfully", token: accessToken });
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

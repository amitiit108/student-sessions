const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const db = require("../database/models");
const Dean = db.dean;
const deanToken = db.deanToken;

exports.register = async (req, res) => {
  try {
    const { universityId, password } = req.body;

    // Check if the dean already exists
    const existingDean = await Dean.findOne({ where: { universityId } });

    if (existingDean) {
      return res.status(400).json({ message: "Dean already registered" });
    }

    // Generate a random salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student record in the database
    const newDean = await Dean.create({
      universityId,
      password_hash: hashedPassword,
      password_salt: salt,
    });

    const response = {
      universityId: newDean?.universityId,
    };

    return res
      .status(201)
      .json({ message: "Registration successful", dean: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { universityId, password } = req.body;

    // Check if the dean exists
    const dean = await Dean.findOne({ where: { universityId } });

    if (!dean) {
      return res.status(404).json({ message: "Dean not found" });
    }

    // Verify the provided password
    const passwordMatch = await bcrypt.compare(password, dean.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a unique token using uuid
    const token = uuid.v4();

    // Create a new token record in the database
    await deanToken.create({
      deanId: dean.id,
      token,
    });

    // Sign a JWT with the token
    const accessToken = jwt.sign(
      { token, deanId: dean?.id, userType: "dean" },
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

// Sample Booking data
// const studentsData = [
//   {
//     universityId: "studentA123",
//     password_hash: await bcrypt.hash("passwordA", 10), // Hashed password for "passwordA"
//     password_salt: await bcrypt.genSalt(10), // Salt for "passwordA"
//   },
//   {
//     universityId: "studentB456",
//     password_hash: await bcrypt.hash("passwordB", 10), // Hashed password for "passwordB"
//     password_salt: await bcrypt.genSalt(10), // Salt for "passwordB"
//   },
//   // Add more student data as needed
// ];

// const deansData = [
//   {
//     universityId: "deanX789",
//     password_hash: await bcrypt.hash("passwordX", 10), // Hashed password for "passwordX"
//     password_salt: await bcrypt.genSalt(10), // Salt for "passwordX"
//   },
//   {
//     universityId: "deanY101",
//     password_hash: await bcrypt.hash("passwordY", 10), // Hashed password for "passwordY"
//     password_salt: await bcrypt.genSalt(10), // Salt for "passwordY"
//   },
//   // Add more dean data as needed
// ];

const slotsData = [
  {
    startTime: new Date('2023-10-07T10:00:00Z'), // Adjust as needed
    endTime: new Date('2023-10-07T11:00:00Z'),   // Adjust as needed
  },
  {
    startTime: new Date('2023-10-07T11:00:00Z'),
    endTime: new Date('2023-10-07T12:00:00Z'),
  },
  // Add more slot data as needed
];

const sessionsData = [
  {
    slotId: 1, // Slot 1's ID
    deanId: 1, // Dean 1's ID
    status: 'available', // Adjust status as needed
  },
  {
    slotId: 2, // Slot 2's ID
    deanId: 2, // Dean 2's ID
    status: 'available',
  },
  // Add more session data as needed
];


const bookingsData = [
  {
    status: 'pending',
    studentId: 1, // Student 1's ID
    sessionId: 1, // Session 1's ID
  },
  {
    status: 'pending',
    studentId: 2, // Student 2's ID
    sessionId: 2, // Session 2's ID
  },
  // Add more booking data as needed
];



 
// (async () => {
//   try {
//     // Bulk insert Bookings
//     // await Student.bulkCreate(studentsData);
//     // await Dean.bulkCreate(deansData);
//     await Slot.bulkCreate(slotsData);
//     await Session.bulkCreate(sessionsData);
//     await Booking.bulkCreate(bookingsData);

//     console.log("Sample data inserted successfully");
//   } catch (error) {
//     console.error("Error inserting sample data:", error);
//   }
// })();

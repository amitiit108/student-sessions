module.exports = {
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "Ratham",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
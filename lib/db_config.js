const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) require("dotenv").config();

const { Pool } = require("pg");

const connectionString = isProduction
  ? process.env.DATABASE_URL
  : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction,
});

console.log("connectionString:");
console.log(connectionString);

module.exports = { pool };

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) require("dotenv").config();

const { Pool } = require("pg");

const connectionString = isProduction
  ? process.env.DATABASE_URL
  : `postgres://giauzvmvpubpak:cf9c56dcb67a8f69d0f6856073e2cdeb7ed42acc47d36d6f57ee598fd1216e79@ec2-34-197-188-147.compute-1.amazonaws.com:5432/d87idfe9clk6jm`;
// : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
  // ssl: isProduction,
});

console.log("connectionString:");
console.log(connectionString);

const testDb = async () => {
  let result;
  try {
    result = await pool.query("select count(*) as count from organisation");
  } catch (err) {
    console.error(err);
  }
  console.log(
    `DB successfully connected. Organisation table has ${result.rows[0].count} rows.`
  );
};

testDb();

module.exports = { pool };

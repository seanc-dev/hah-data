const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  ssl: isProduction,
});

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

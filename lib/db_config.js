/* eslint-disable no-undef */
import dotenv from "dotenv";
import pg from "pg";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) dotenv.config();

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.NODE_ENV === "development"
			? false
			: { rejectUnauthorized: false },
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

export default { pool };

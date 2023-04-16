import dbConfig from "../../../lib/db_config.js";

const { pool } = dbConfig;

export const getOrgIdFromShortName = async (orgShortName, client) => {
	if (!client) client = pool;
	try {
		const result = await client.query(
			"select id from organisation where shortname = $1",
			[orgShortName]
		);
		return result.rows[0].id;
	} catch (err) {
		console.error(err);
	}
};

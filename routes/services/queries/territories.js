import dbConfig from "../../../lib/db_config.js";

const { pool } = dbConfig;

export default {
	getTerritories: async (orgShortName) => {
		const queryStr = `select t.territoryname from territory t inner join organisation o on t.ownedbyorganisationid = o.id where o.shortname = $1`;
		try {
			const territories = await pool.query(queryStr, [orgShortName]);
			return territories;
		} catch (err) {
			console.error("Error in territories.getTerritories");
			console.error(err);
			return err;
		}
	},

	getAreaByTerritoryName: async (territoryName) => {
		const queryStr = `select a.areaname from territory t inner join area a on t.areaid = a.id where t.territoryname = $1`;
		try {
			const data = await pool.query(queryStr, [territoryName]);
			return data;
		} catch (err) {
			console.error("Error in territories.getAreaByTerritoryName");
			console.error(err);
			return err;
		}
	},
};

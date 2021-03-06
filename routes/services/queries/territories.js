const { pool } = require("../../../lib/db_config");

module.exports = {
  getTerritories: async (businessShortName) => {
    const queryStr = `select t.territoryname from territory t`;
    try {
      const territories = await pool.query(queryStr);
      return territories;
    } catch (err) {
      console.error("Error in territories.getTerritories");
      console.error(err);
      return err;
    }
  },

  getAreaByTerritoryName: async (territoryName) => {
    const queryStr = `select t.territoryname, case when t.ownedbyorganisationid is null then 'Other' else a.areaname end as area from territory t inner join area a on  t.areaid = a.id where t.territoryname = $1`;
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

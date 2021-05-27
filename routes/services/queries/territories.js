const { pool } = require("../../../lib/db_config");

module.exports = {
  getTerritories: async (businessShortName) => {
    const queryStr = `select t.territoryname from territory t`;
    try {
      const territories = await pool.query(queryStr);
      return territories;
    } catch (err) {
      return console.error(err);
    }
  },

  getAreaByTerritoryName: async (territoryName) => {
    const queryStr = `select t.territoryname, case when t.ownedbyorganisationid is null then 'Other' else a.areaname end as area from territory t inner join area a on  t.areaid = a.id`;
    let data;
    try {
      data = await pool.query(queryStr);
    } catch (err) {
      return console.error(err);
    }
    return data;
  },
};

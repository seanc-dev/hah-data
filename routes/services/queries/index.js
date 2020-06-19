const { pool } = require("./../../../lib/db_config");
const { getJobById } = require("./job");
const { getClientById } = require("./client");

module.exports = {
  getColumnHeaders: async (tableName, orgShortName) => {
    const queryStr =
      tableName === "client"
        ? "select min(c.id) as id from client as c inner join organisation as o on c.organisationid = o.id where o.shortname = $1"
        : "select min(j.id) as id from job as j inner join client as c on j.clientid = c.id inner join organisation as o on c.organisationid = o.id where o.shortname = $1";
    try {
      const {
        rows: [{ id }],
      } = await pool.query(queryStr, [orgShortName]);
      const fn = tableName === "client" ? getClientById : getJobById;
      const data = await fn(id, orgShortName);
      const keys = Object.keys(data);
      return keys.filter((key) => key !== "organisationid");
    } catch (err) {
      throw err;
    }
  },

  getOrgId: async (orgShortName) => {
    let result;
    try {
      result = await pool.query(
        "select id from organisation where shortname = $1",
        [orgShortName]
      );
    } catch (err) {
      console.error(err);
      return err;
    }
    return result.rows[0].id;
  },
};

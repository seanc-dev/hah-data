const { pool } = require("./../../../lib/db_config");

module.exports = {
  client: require("./client"),
  job: require("./job"),
  getColumnHeaders: async (tableName) => {
    let result;
    try {
      result = await pool.query(
        "select column_name from information_schema.columns where table_name = $1 and column_name != 'organisationid'",
        [tableName]
      );
    } catch (err) {
      console.error(err);
    }
    console.log(result.rows);
    return result.rows;
  },
  getStaffNames: async (orgShortName) => {
    let result;
    try {
      result = await pool.query(
        "select distinct staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1",
        [orgShortName]
      );
    } catch (err) {
      console.error(err);
    }
    return results.rows.map((row) => row.staffmembername);
  },
};

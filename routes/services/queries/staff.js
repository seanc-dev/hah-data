const { pool } = require("../../../lib/db_config");
const { getStaffRatesByJobId } = require("./queryBuilders/staff");

module.exports = {
  getStaffNames: async function (orgShortName, client) {
    if (!client) client = pool;
    try {
      const result = await client.query(
        "select distinct staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1 and s.currentlyemployed = 1",
        [orgShortName]
      );
      return result.rows.map((row) => row.staffmembername);
    } catch (err) {
      throw err;
    }
  },

  getStaffRatesByJobId: async function (orgId, jobId) {
    let ratesResult;
    let staffNames = await this.getStaffNames(orgId);
    console.log(staffNames);
    try {
      ratesResult = await pool.query(getStaffRatesByJobId(staffNames), [jobId]);
      return ratesResult.rows[0];
    } catch (err) {
      throw err;
    }
  },
};

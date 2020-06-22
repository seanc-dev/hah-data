const { pool } = require("../../../lib/db_config");
const { getStaffRatesByJobId } = require("./queryBuilders/staff");

module.exports = {
  getStaffNames: async (orgShortName, client) => {
    if (!client) client = pool;
    let result;
    try {
      result = await client.query(
        "select distinct staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1",
        [orgShortName]
      );
    } catch (err) {
      console.error(err.stack);
      throw err;
    }
    return result.rows.map((row) => row.staffmembername);
  },
  getStaffRatesByJobId: async (orgId, jobId) => {
    let ratesResult;
    let staffNames = this.getStaffNames(orgId);
    try {
      ratesResult = await pool.query(getStaffRatesByJobId(staffNames), [jobId]);
      return ratesResult.rows[0];
    } catch (err) {
      throw err;
    }
  },
};

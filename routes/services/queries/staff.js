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

  getStaffIdArray: async (orgId, client) => {
    if (!client) client = pool;
    const staffResult = await client.query(
      "select s.id, s.staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1 and currentlyemployed = 1",
      [orgId]
    );
    const staffIdArray = staffResult.rows;
    return staffIdArray;
  },

  insertStaffJobHours: async (staffNames, staffIdArray, id, body, client) => {
    if (!client) client = pool;

    let jobHoursQueryStr =
      "insert into staff_job_hours (jobid, staffid, hoursworked) values ";
    const parametersArray = [];

    staffNames.forEach((name, idx) => {
      const idxMultiple = idx * 3;
      const staffObj = staffIdArray.find(
        ({ staffmembername }) =>
          staffmembername.replace(" ", "").toLowerCase() ===
          name.replace(" ", "").toLowerCase()
      );
      if (!staffObj) return;
      const staffId = staffObj.id;
      const hoursWorked = body[`hoursWorked${name}`];
      jobHoursQueryStr += `($${1 + idxMultiple}, $${2 + idxMultiple}, $${
        3 + idxMultiple
      })${idx !== staffNames.length - 1 ? ", " : ""}`;
      parametersArray[0 + idxMultiple] = id;
      parametersArray[1 + idxMultiple] = staffId;
      parametersArray[2 + idxMultiple] = hoursWorked;
    });
    try {
      return await client.query(jobHoursQueryStr, parametersArray);
    } catch (err) {
      console.error(err);
    }
  },
};

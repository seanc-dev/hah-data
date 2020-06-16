const { pool } = require("./../../../lib/db_config");
const queries = require("./index");

module.exports = {
  getJobDetails: (req, res) => {
    pool.query(
      "SELECT c.id as clientId, j.id as jobId, c.accountname, j.dateinvoicesentutc, j.amountinvoiced FROM job as j inner join (select id, accountname, organisationid from client) as c on j.clientid = c.id inner join organisation as o on c.organisationid = o.id where o.shortname = $1",
      [req.params.orgId],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).send(error);
        }
        console.log("getJobDetails result.length: " + result.rows.length);
        let arr = result.rows.map((obj) => {
          return {
            clientId: obj.clientid,
            jobId: obj.jobid,
            accountName: obj.accountname,
            dateInvoiceSent: obj.dateinvoicesentutc,
            amountInvoiced: obj.amountinvoiced,
          };
        });
        res.send(arr);
      }
    );
  },
  getJobById: async (req, res) => {
    let { id, orgId } = req.params;
    let staffNames;
    try {
      staffNames = await queries.getStaffNames(orgId);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send(new Error("Could not retrieve staff details from database"));
    }
    // construct query string with staff names added to crosstab
    let queryStr =
      "select * from (select * from job where id = $1) as j inner join (SELECT * FROM crosstab('SELECT sjh.jobid, s.staffmembername as name, sjh.hoursworked FROM staff_job_hours as sjh inner join (select s.id, s.staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = ''$2'') as s on sjh.staffid = s.id where sjh.jobid = $1 ORDER  BY 1', $$VALUES ('" +
      staffNames.join("'), ('") +
      "')$$) AS ct (jobid int, " +
      staffNames.join(" numeric(5,2), ") +
      " numeric(5,2))) as h on j.id = h.jobid;";
    let jobDetail;
    try {
      jobDetail = await pool.query(queryStr, [id, orgId]);
      res.json(jobDetail);
    } catch (err) {
      console.error(err);
      res.status(500).send(jobDetail);
    }
  },
};

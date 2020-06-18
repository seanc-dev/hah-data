const { pool } = require("./../../../lib/db_config");
const { getStaffNames } = require("./staff");
const queryBuilders = require("./queryBuilders/job");

module.exports = {
  createJob: async (req, res) => {
    const dbWork = async (req, res) => {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const result = await client.query("", []);
        await client.query("commit");
        res.json(result.rows[0]);
      } catch (err) {
        client.query("rollback");
        res.status(500).send(err);
        throw err;
      } finally {
        client.release();
      }
    };
    dbWork(req, res).catch((e) => console.error(e.stack));
  },
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
  getJobById: async (id, orgId) => {
    let staffNames, jobDetail;
    try {
      staffNames = await getStaffNames(orgId);
      // build mega long query string (can find original in queries/getJobById.pgsql)
      let queryStr = queryBuilders.getJobById(staffNames);
      // execute mega long query string
      jobDetail = await pool.query(queryStr, [id]);
      return jobDetail.rows[0];
    } catch (err) {
      console.error(`Couldn't retrieve job details for job with id ${id}`);
      throw err;
    }
  },
};

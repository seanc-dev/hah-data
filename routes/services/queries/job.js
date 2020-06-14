const { pool } = require("./../../../lib/db_config");

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
        console.log("getClientDetails result.length: " + result.rows.length);
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
};

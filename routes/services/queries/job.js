const queryBuilders = require("./queryBuilders/job"),
  staffQueries = require("./staff"),
  Job = require("../../../lib/classes/job"),
  lib = require("./../../../lib/library");

const { pool } = require("./../../../lib/db_config");

module.exports = {
  createJob: async (req, res) => {
    // replace empty strings with string null values for insert
    const { orgId } = req.params;
    const body = lib.prepareDataForDbInsert(req.body);
    // extract staffNames from body for staff_job_hours insert
    const staffNames = lib.getStaffNamesFromJobPost(body);
    // create id var outside of block
    let id;
    // connect node-postgres client
    const client = await pool.connect();
    try {
      await client.query("begin");
      // execute job insert
      const result = await client.query(
        "insert into job (clientid, worklocationstreetaddress, worklocationsuburb, primaryjobtype, secondaryjobtype, indoorsoutdoors, datejobenquiryutc, datejobquotedutc, dateworkcommencedutc, dateinvoicesentutc, amountinvoiced, costmaterials, costsubcontractor, costtipfees, costother, worksatisfaction)  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) returning id",
        [
          body["clientId"],
          body["workLocationStreetAddress"],
          body["workLocationSuburb"],
          body["primaryJobType"],
          body["secondaryJobType"],
          body["indoorsOutdoors"],
          body["dateJobEnquiry"],
          body["dateJobQuoted"],
          body["dateWorkCommenced"],
          body["dateInvoiceSent"],
          body["amountInvoiced"],
          body["costMaterials"],
          body["costSubcontractor"],
          body["costTipFees"],
          body["costOther"],
          body["workSatisfaction"],
        ]
      );
      id = result.rows[0].id;
      // pull back staff names & ids (staff_job_hours requires staffId insert)
      // could to a joined select insert but that's a little inconvenient with
      // with multiple rows
      const staffResult = await client.query(
        "select s.id, s.staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1",
        [orgId]
      );
      const staffIdArray = staffResult.rows;
      // loop through staffNames, find variables, construct staff_job_hours insert and parameters array
      let jobHoursQueryStr =
        "insert into staff_job_hours (jobid, staffid, hoursworked) values ";
      let parametersArray = [];
      staffNames.forEach((name, idx) => {
        const idxMultiple = idx * 3;
        const staffId = staffIdArray.find(
          ({ staffmembername }) =>
            staffmembername.toLowerCase() === name.toLowerCase()
        ).id;
        const hoursWorked = body[`hoursWorked${lib.capitaliseWords(name)}`];
        jobHoursQueryStr += `($${1 + idxMultiple}, $${2 + idxMultiple}, $${
          3 + idxMultiple
        })${idx !== staffNames.length - 1 ? ", " : ""}`;
        parametersArray[0 + idxMultiple] = id;
        parametersArray[1 + idxMultiple] = staffId;
        parametersArray[2 + idxMultiple] = hoursWorked;
      });
      await client.query(jobHoursQueryStr, parametersArray);
      await client.query("commit");
      // return jobid of successful insert
      res.json({ id });
    } catch (err) {
      client.query("rollback");
      res.status(500).send(err);
      throw err;
    } finally {
      client.release();
    }
    // Fire off async insert into google sheets for job record - must do this here as we require (and don't
    // return) the id for the newly created record
    const getData = require("../getData");
    getData.crud(new Job(orgId, id, body), "new");
  },
  deleteJobById: async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query("delete from staff_job_hours where jobid = $1", [id]);
      await client.query("delete from job where id = $1", [id]);
      await client.query("commit");
      res.json(result.rows[0]);
      console.log(`Job record with id ${id} successfully deleted`);
    } catch (err) {
      client.query("rollback");
      res.status(500).send(err);
      throw err;
    } finally {
      client.release();
    }
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
    let staffNames, jobResult;
    try {
      staffNames = await staffQueries.getStaffNames(orgId);
      // build mega long query string (can find original in queries/getJobById.pgsql)
      let queryStr = queryBuilders.getJobById(staffNames);
      // execute mega long query string
      jobResult = await pool.query(queryStr, [id]);
      const jobObj = jobResult.rows[0];
      const mappedJobObj = {};
      const keys = Object.keys(jobObj);
      keys.forEach((key) => {
        mappedJobObj[
          lib.getObjectFromKey(orgId, "job", "dbHeader", key, "fieldName")
        ] = jobObj[key];
      });
      return mappedJobObj;
    } catch (err) {
      console.error(`Couldn't retrieve job details for job with id ${id}`);
      throw err;
    }
  },
  updateJobById: async (req, res) => {
    const { orgId, id } = req.params;
    // create id outside of block
    const body = lib.prepareDataForDbInsert(req.body);
    const client = await pool.connect();
    try {
      await client.query("begin");
      const result = await client.query(
        "update job as j set worklocationstreetaddress = $2, worklocationsuburb = $3, primaryjobtype = $4, secondaryjobtype = $5, indoorsoutdoors = $6, datejobenquiryutc = $7, datejobquotedutc = $8, dateworkcommencedutc = $9, dateinvoicesentutc = $10, amountinvoiced = $11, costmaterials = $12, costsubcontractor = $13, costtipfees = $14, costother = $15, worksatisfaction = $16 where j.id = $1 returning id",
        [
          id,
          body["workLocationStreetAddress"],
          body["workLocationSuburb"],
          body["primaryJobType"],
          body["secondaryJobType"],
          body["indoorsOutdoors"],
          body["dateJobEnquiryutc"],
          body["dateJobQuoted"],
          body["dateWorkCommenced"],
          body["dateInvoiceSent"],
          body["amountInvoiced"],
          body["costMaterials"],
          body["costSubcontractor"],
          body["costTipFees"],
          body["costOther"],
          body["workSatisfaction"],
        ]
      );
      await client.query("commit");
      res.json({ id });
    } catch (err) {
      client.query("rollback");
      res.status(500).send(err);
      throw err;
    } finally {
      client.release();
    }
    // Fire off async insert into google sheets for job record - must do this here as we require (and don't
    // return) the id for the newly created record
    const getData = require("../getData");
    getData.crud(new Job(orgId, id, body), "edit");
  },
};

const { pool } = require("./../../../lib/db_config");

const lib = require("./../../../lib/library");
const staffQueries = require("./staff");
const clientQueries = require("./queryBuilders/client");

module.exports = {
  createClient: async (req, res) => {
    const dbWork = async (req, res) => {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const result = await client.query(
          "insert into client (accountname, maincontactfirstname, maincontactlastname, maincontactemail, maincontactmobile, maincontactlandline, businessname, billingaddressstreet, billingaddresssuburb, territory, customerdemographic, estimatedcustomerincome, acquisitionchannel) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning id",
          [
            req.body["accountName"],
            req.body["mainContactFirstName"],
            req.body["mainContactLastName"],
            req.body["mainContactEmail"],
            req.body["mainContactMobile"],
            req.body["mainContactLandLine"],
            req.body["businessName"],
            req.body["billingAddressStreet"],
            req.body["billingAddressSuburb"],
            req.body["territory"],
            req.body["customerDemographic"],
            req.body["estimatedCustomerIncome"],
            req.body["acquisitionChannel"],
          ]
        );
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
  deleteClientById: async (req, res) => {
    const { id } = req.params;
    let result;
    try {
      result = await pool.query("delete from client where id = $1", [id]);
      console.log(result);
      res.send(`Client record with id ${id} successfully deleted.`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },
  getClientDetails: (req, res) => {
    pool.query(
      "SELECT c.id, accountname, billingaddressstreet, billingaddresssuburb FROM client as c inner join organisation as o on c.organisationid = o.id where o.shortname = $1",
      [req.params.orgId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send(error);
        }
        console.log("getClientDetails results.length: " + results.rows.length);
        let arr = results.rows.map((obj) => {
          return {
            clientId: obj.id,
            accountName: obj.accountname,
            billingAddressStreet: obj.billingaddressstreet,
            billingAddressSuburb: obj.billingaddresssuburb,
          };
        });
        res.json(arr);
      }
    );
  },
  getClientById: async (id, orgId) => {
    const dbWork = async (id, orgId) => {
      let clientDetailsObject;
      const client = await pool.connect();
      try {
        const staffNames = await staffQueries.getStaffNames(orgId, client);
        const jobDetails = await client.query(
          clientQueries.getJobsByClientIdQuery(staffNames),
          [id]
        );
        const clientDetails = await client.query(
          "select * from client where id = $1",
          [id]
        );
        // combine job details to client
        const jobDetailsData = jobDetails.rows;
        clientDetailsObject = {
          ...clientDetails.rows[0],
          countJobs: jobDetailsData.length,
          sumJobValue: lib.sumKeyInObjectsArray(
            jobDetailsData,
            "amountinvoiced"
          ),
          sumJobCost: lib.sumKeyInObjectsArray(jobDetailsData, "totaljobcost"),
          sumJobGrossProfit: lib.sumKeyInObjectsArray(
            jobDetailsData,
            "grossprofit"
          ),
          sumJobHours: lib.sumKeyInObjectsArray(
            jobDetailsData,
            "totalhoursworked"
          ),
          mostRecentJobInvoicedDateUTC: lib.getMaxDateFromArrayOfObjects(
            jobDetailsData,
            "dateinvoicesentutc"
          ),
        };
      } catch (err) {
        throw err;
      } finally {
        client.release();
      }
      return clientDetailsObject;
    };
    return dbWork(id, orgId)
      .then((r) => r)
      .catch((e) => {
        throw e;
      });
  },
  updateClientById: (req, res) => {
    const { id } = req.params;
    try {
      pool.query(
        "update client set accountname = $1, maincontactfirstname = $2, maincontactlastname = $3, maincontactemail = $4, maincontactmobile = $5, maincontactlandline = $6, businessname = $7, billingaddressstreet = $8, billingaddresssuburb = $9, territory = $10, customerdemographic = $11, estimatedcustomerincome = $12, acquisitionchannel = $13 where id = $14",
        [
          req.body["accountName"],
          req.body["mainContactFirstName"],
          req.body["mainContactLastName"],
          req.body["mainContactEmail"],
          req.body["mainContactMobile"],
          req.body["mainContactLandLine"],
          req.body["businessName"],
          req.body["billingAddressStreet"],
          req.body["billingAddressSuburb"],
          req.body["territory"],
          req.body["customerDemographic"],
          req.body["estimatedCustomerIncome"],
          req.body["acquisitionChannel"],
          id,
        ]
      );
      res.send(`${accountName} client record successfully updated`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },
};

//  , Count(j.id)             as countjobs
//  , Sum(j.amountinvoiced)   as sumjobvalue
//  , Sum(j.totaljobcost)     as sumjobcost
//  , Sum(j.grossprofit)      as sumjobgrossprofit
//  , Sum(totalhoursworked)   as sumjobhours
//  , Max(dateinvoicesentutc) as mostrecentjobinvoiceddateutc

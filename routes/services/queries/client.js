const { pool } = require("./../../../lib/db_config");
const lib = require("./../../../lib/library");

module.exports = {
  createClient: async (req, res) => {
    const { orgId } = req.params;
    let result;
    try {
      result = await pool.query(
        "insert into client (accountname, maincontactfirstname, maincontactlastname, maincontactemail, maincontactmobile, maincontactlandline, businessname, billingaddressstreet, billingaddresssuburb, territory, customerdemographic, estimatedcustomerincome, acquisitionchannel) values ($$$1$$, $$$2$$, $$$3$$, $4, $5, $6, $$$7$$, $$$8$$, $$$9$$, $$$10$$, $11, $12, $13)",
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
      console.log(result);
      res.send(`Client record successfully created for ${accountName}`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
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
  getClientById: async (req, res) => {
    let result;
    try {
      result = await pool.query(
        "select  accountname, maincontactfirstname, maincontactlastname, maincontactemail, maincontactmobile, maincontactlandline, businessname, billingaddressstreet, billingaddresssuburb, territory, customerdemographic, estimatedcustomerincome, acquisitionchannel, count(j.id) as countjobs, sum(j.amountinvoiced) as sumjobvalue, sum(j.totaljobcost) as sumjobcost, sum(j.grossprofit) as sumjobgrossprofit, sum(totalhoursworked) as sumjobhours, max(dateinvoicesentutc) as mostrecentjobinvoiceddateutc from organisation as o inner join client as c on o.id = c.organisationid inner join job as j on c.id = j.clientid where c.id = $1 and o.shortname = $2 group by accountname, maincontactfirstname, maincontactlastname, maincontactemail, maincontactmobile, maincontactlandline, businessname, billingaddressstreet, billingaddresssuburb, territory, customerdemographic, estimatedcustomerincome, acquisitionchannel",
        [req.params.id, req.params.orgId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
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

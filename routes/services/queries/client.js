const { pool } = require("./../../../lib/db_config");

module.exports = {
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
        res.send(arr);
      }
    );
  },
  getAddressDetailsById: (req, res, clientId) => {
    pool.query(
      "SELECT c.billingaddressstreet, c.billingaddresssuburb FROM client as c inner join organisation as o on c.organisationid = o.id where o.shortname = $1 and c.id = $2",
      [req.params.orgId, clientId],
      (error, results) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log("getAddressDetailsById results");
        console.log("results.length: " + results.rows.length);
        console.log(results.rows);
        // res.status(200).json(results.rows);
      }
    );
  },
};

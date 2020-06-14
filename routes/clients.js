const express = require("express");

const lib = require("../lib/library.js"),
  ss = require("../lib/spreadsheet"),
  Client = require("../lib/classes/client.js"),
  // geocodeAddress = require("./services/geocode.js"),
  getData = require("./services/getData.js"),
  queries = require("./services/queries/client");

const config = require("../lib/config.js");
const { getKeysFromDb } = require("./services/getData.js");

const router = express.Router({
  mergeParams: true,
});

// index route
router.get("/", (req, res) => {
  if (req.query.requestType === "detailsArray") {
    queries.getClientDetails(req, res);
    // return array of objects for all records in org. Objects contain clientId, accountName, bililngAddressStreet, billingAddressSuburb
    // ss.getClientDetailsArray(req.params.orgId)
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((err) => {
    //     console.error("Failed to retrieve clients array");
    //     console.error(err);
    //     res.status(500).send(err);
    //   });
  } else if (req.query.requestType === "address") {
    // queries.getAddressDetailsById(req, res, id);
    // // return billing address street and suburb for 1 record by id (this can probably be retrieved from appData in localStorage on client)
    // getData
    //   .getAddressString(req)
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((err) => {
    //     console.error("Failed to retrieve clients address");
    //     console.error(err);
    //     res.status(500).send(err);
    //   });
  } else if (req.query.requestType === "keys") {
    getKeysFromDb(req.params.orgId, "client", req, res);
    // return object with arrays of field labels and names from db column headers (in sheet currently)
    // let client = new Client(req.params.orgId, 1, false);
    // getData
    //   .getKeys(client, req, res)
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((err) => {
    //     res.status(500).send(err);
    //   });
  }
});

// create route
router.post("/", (req, res) => {
  // 1. search all client records for pre-existing accountName
  // 2. insert new record in client sheet
  // 3. return inserted data

  //   let location =
  //     req.body.billingAddressStreet +
  //     " " +
  //     req.body.billingAddressSuburb +
  //     " " +
  //     req.body.billingAddressCity +
  //     " " +
  //     req.body.billingAddressPostcode;

  ss.getClientDetailsArray(req.params.orgId)
    .then((result) => {
      // test for account name similarity

      if (
        result.find((el) => {
          el.accountName === req.body.accountName;
        })
      ) {
        let errorMessage =
          "Client record with that account name already exists in database";
        console.error(errorMessage);
        res.status(500).send(new Error(errorMessage));
      }
    })
    // .then((result) => {this is where I would add the test for address similarity if requested (note - should be replaced by db keys later)})
    .catch((error) => {
      console.error(error);
      console.error(
        "Error in client create route: Failed to get client details array from DB"
      );
    })
    .then((result) => {
      //   geocodeAddress(location)
      //     .then(function (result) {
      //       req.body.billingAddressLatitude = result[0].latitude;
      //       req.body.billingAddressLongitude = result[0].longitude;
      //       req.body.billingAddressFormatted = result[0].formattedAddress;
      //       req.body.billingAddressGPID = result[0].extra.googlePlaceId;

      //       getData.crud(
      //         res,
      //         new Client(req.params.orgId, false, req.body),
      //         "new"
      //       );
      //     })
      //     .catch((err) => {
      //       console.error("Failed to geocode Client's Billing Address");
      //       console.error(err);

      getData.crud(res, new Client(req.params.orgId, false, req.body), "new");
      // });
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send(err);
    });
});

// show
router.get("/:id", (req, res) => {
  // return single client record by id
  getData.crud(res, new Client(req.params.orgId, req.params.id, false), "view");
});

// update
router.put("/:id", (req, res) => {
  // update single client record by id
  getData.crud(
    res,
    new Client(req.params.orgId, req.params.id, req.body),
    "edit"
  );
});

// destroy
router.delete("/:id", (req, res) => {
  // delete single client record by id
  getData.crud(
    res,
    new Client(req.params.orgId, req.params.id, req.body),
    "delete"
  );
});

module.exports = router;

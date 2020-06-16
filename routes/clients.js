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
  } else if (req.query.requestType === "keys") {
    getKeysFromDb(req.params.orgId, "client", req, res);
  }
});

// create route
router.post("/", (req, res) => {
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
      console.log(req.body);
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

const express = require("express");

const queries = require("./services/queries/client");
const getData = require("./services/getData.js");

const router = express.Router({
  mergeParams: true,
});

// index route
router.get("/", (req, res) => {
  if (req.query.requestType === "detailsArray") {
    queries.getClientDetails(req, res);
  } else if (req.query.requestType === "keys") {
    getData.getKeysFromDb(req.params.orgId, "client", req, res);
  }
});

// create route
router.post("/", queries.createClient);

// show
router.get("/:id", getData.getClientById);

// update
router.put("/:id", queries.updateClientById);

// destroy
router.delete("/:id", queries.deleteClientById);

module.exports = router;

const express = require("express");

const queries = require("./services/queries/client");
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
router.post("/", queries.createClient);

// show
router.get("/:id", queries.getClientById);

// update
router.put("/:id", queries.updateClientById);

// destroy
router.delete("/:id", queries.deleteClientById);

module.exports = router;

import express from "express";

import queries from "./services/queries/client.js";
import getData from "./services/getData.js";

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

export default router;

const   express = require("express");

const   mapping = require("../lib/mapping.js"),
        ss      = require("../lib/spreadsheet.js"),
        Client  = require("../lib/classes/client.js");

const   router  = express.Router({mergeParams: true});

// index route
router.get("/", (req, res) => {
    if(req.query.requestType === "clients") {
        let clientsArr = ss.getClientDetailsArray(req.params.orgId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients array");
                res.send("Error retrieving client details");
            });
    } else if(req.query.requestType === "clientAddress") {
        ss.getAddressDetailsArray(req.params.orgId, req.query.clientId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients address");
            });
    }
});

router.get("/rows", function(req, res) {
    ss.getRowsArrayDataOnly(req.params.orgId, "job", mapping["job"], 1, "clientid=3")
        .then((result) => {
            res.send(result);
        })
        .catch(console.error);
});

// create route
router.post("/", (req, res) => {
    new Client(req.params.orgId, false, req.body);
    res.redirect("/" + req.params.orgId);
})

module.exports = router;
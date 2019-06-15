const   express     = require("express");

const   ss          = require("../lib/spreadsheet.js"),
        DataObject  = require("../lib/classes/dataobject.js");

const   router      = express.Router({mergeParams: true});

// index route
router.get("/", (req, res) => {
    if(req.query.requestType === "clients") {
        let clientsArr = ss.getClientDetailsArray()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients array");
                res.send("Error retrieving client details");
            });
    } else if(req.query.requestType === "clientAddress") {
        ss.getAddressDetailsArray(req.query.clientId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients address");
            });
    }
});

router.get("/rows", function(req, res) {
    ss.getRowsArray(2, 1, 2)
        .then((result) => {
            res.send(result);
        })
});

// create route
router.post("/", (req, res) => {
    let newObj = new DataObject(req.params.orgId, 'client', req.body);
    console.log(newObj);
    res.redirect("/" + req.params.orgId);
})

module.exports = router;
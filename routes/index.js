const express = require("express");

const ss = require("../lib/spreadsheet.js"),
  formOptions = require("../lib/form-options.js"),
  queries = require("./services/queries/index");
const getData = require("./services/getData.js");

const router = express.Router({
  mergeParams: true,
});

// show form
router.get("/:orgShortName", function (req, res) {
  let { orgShortName } = req.params;
  if (orgShortName === "kapiti" || orgShortName === "wellington") {
    if (!req.query.data) {
      res.render("forms", {
        businessName: orgShortName,
        businessNameDisplay:
          orgShortName[0].toUpperCase() + orgShortName.slice(1),
      });
    } else {
      console.log("orgshortname/data=true route");
      getData
        .getOrgDetailsByShortName(orgShortName)
        .then(({ organisationId, staffNames }) => {
          let data = {
            formOptions: formOptions[orgShortName],
            businessName: orgShortName,
            businessNameDisplay:
              orgShortName[0].toUpperCase() + orgShortName.slice(1),
            organisationId,
            staffNames,
          };
          console.log(data);
          res.send(data);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  } else {
    res.status(404).send("Not found");
  }
});

module.exports = router;

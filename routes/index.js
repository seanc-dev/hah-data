const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const getData = require("./services/getData.js");
const formOptions = require("../lib/form-options.js");

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
      getData
        .getOrgDetailsByShortName(orgShortName)
        .then(({ organisationId, staffNames, territories }) => {
          console.log(territories);
          const data = {
            formOptions: {
              ...formOptions[orgShortName],
              clientDetails: {
                ...formOptions[orgShortName].clientDetails,
                fields: {
                  ...formOptions[orgShortName].clientDetails.fields,
                  cd_territory: {
                    ...formOptions[orgShortName].clientDetails.fields
                      .cd_territory,
                    values: ["", ...territories],
                  },
                },
              },
            },
            businessName: orgShortName,
            businessNameDisplay:
              orgShortName[0].toUpperCase() + orgShortName.slice(1),
            organisationId,
            staffNames,
          };
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

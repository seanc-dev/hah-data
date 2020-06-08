const express = require("express");

const ss = require("../lib/spreadsheet.js"),
  formOptions = require("../lib/form-options.js");

const router = express.Router({
  mergeParams: true,
});

// show form
router.get("/:orgId", function (req, res) {
  let orgId = req.params.orgId;
  if (orgId === "kapiti" || orgId === "wellington") {
    if (!req.query.data) {
      res.render("forms", {
        businessName: orgId,
        businessNameDisplay: orgId[0].toUpperCase() + orgId.slice(1),
      });
    } else {
      res.send({
        formOptions: formOptions[orgId],
        businessName: orgId,
        businessNameDisplay: orgId[0].toUpperCase() + orgId.slice(1),
      });
    }
  } else {
    res.status(404).send("Not found");
  }
});

module.exports = router;

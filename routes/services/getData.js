const lib = require("../../lib/library.js"),
  queries = require("./queries/index"),
  jobQueries = require("./queries/job"),
  staffQueries = require("./queries/staff"),
  clientQueries = require("./queries/client"),
  { getTerritories } = require("./queries/territories");

module.exports = {
  crud: async function (inst, requestType) {
    // initialise instance with requested action
    try {
      const result = await inst.init(requestType);
      console.log(
        `Successful ${requestType} init for ${inst.dimension} record with id ${
          result[`${inst.dimension.toLowerCase()}Id`]
        }`
      );
    } catch (err) {
      console.error(
        `Error in ${inst.dimension} ${requestType} getData.crud: Failed to initiate instance`
      );
      console.error(err);
    }
    try {
      // if job added, edited, or removed, update computed fields on relevant client record
      if (inst.dimension === "job" && requestType !== "view") {
        inst.initClientUpdate.bind(inst)();
      }
    } catch (err) {
      console.error(
        `Failed to initiate client update on job record ${requestType}`
      );
    }
  },
  getKeysFromDb: (orgShortName, dim, req, res) => {
    queries
      .getColumnHeaders(dim.toLowerCase(), orgShortName)
      .then((fieldNames) => {
        let obj = {
          fieldLabels: fieldNames.map((columnName) =>
            lib.getObjectFromKey(
              orgShortName,
              dim,
              "fieldName",
              columnName,
              "sheetHeaderName"
            )
          ),
          fieldNames,
        };
        res.json(obj);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  },
  getOrgDetailsByShortName: async (orgShortName) => {
    let resultArr;
    try {
      resultArr = await Promise.all([
        queries.getOrgId(orgShortName),
        staffQueries.getStaffNames(orgShortName),
        getTerritories(orgShortName),
      ]);

      return {
        organisationId: resultArr[0],
        staffNames: resultArr[1],
        territories: resultArr[2].rows.map((row) => row.territoryname),
      };
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  getJobById: (req, res) => {
    const { id, orgId } = req.params;
    jobQueries
      .getJobById(id, orgId)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.error(err.stack);
        res.status(500).send(err);
      });
  },
  getClientById: (req, res) => {
    const { id, orgId } = req.params;
    clientQueries
      .getClientById(id, orgId)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.error(err.stack);
        res.status(500).send(err);
      });
  },
};

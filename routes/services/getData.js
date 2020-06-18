const lib = require("../../lib/library.js"),
  ss = require("../../lib/spreadsheet.js"),
  mapping = require("../../lib/mapping.js"),
  queries = require("./queries/index"),
  jobQueries = require("./queries/job"),
  clientQueries = require("./queries/client"),
  { getStaffNames } = require("./queries/staff");

module.exports = {
  crud: function (res, inst, requestType) {
    // initialise instance with requested action
    let init = new Promise((resolve, reject) => {
      try {
        resolve(inst.init(requestType));
      } catch (err) {
        console.error(
          `Error in ${inst.dimension} ${requestType} crud service: Failed to initiate instance`
        );
        console.error(err);
        reject(err);
      }
    });

    init
      .then((result) => {
        console.log(
          `Successful ${requestType} init for ${
            inst.dimension
          } record with id ${result[`${inst.dimension.toLowerCase()}Id`]}`
        );
        res.send(result);
        if (inst.dimension === "job" && requestType !== "view") {
          inst.initClientUpdate.bind(inst)();
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500).send(err);
      });
  },

  getJobDetailsArray: async function (req) {
    return await ss.getJobDetailsArray(req.params.orgId);
  },

  getKeysFromDb: (orgShortName, dim, req, res) => {
    queries
      .getColumnHeaders(dim.toLowerCase(), orgShortName)
      .then((result) => {
        let fieldNames = result.map((columnName) => {
          return lib.getObjectFromKey(
            orgShortName,
            dim,
            "dbHeader",
            columnName,
            "fieldName"
          );
        });
        let obj = {
          fieldLabels: result.map((columnName) =>
            lib.getObjectFromKey(
              orgShortName,
              dim,
              "dbHeader",
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
        getStaffNames(orgShortName),
      ]);
      return {
        organisationId: resultArr[0],
        staffNames: resultArr[1],
      };
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  getJobById: (req, res) => {
    jobQueries
      .getJobById(req.params.id, req.params.orgId)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.error(err.stack);
        res.status(500).send(err);
      });
  },
  getClientById: (req, res) => {
    clientQueries
      .getClientById(req.params.id, req.params.orgId)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.error(err.stack);
        res.status(500).send(err);
      });
  },
};

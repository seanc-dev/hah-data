const lib = require("../../lib/library.js"),
  queries = require("./queries/index"),
  jobQueries = require("./queries/job"),
  clientQueries = require("./queries/client"),
  staffQueries = require("./queries/staff");

module.exports = {
  crud: function (inst, requestType) {
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

        if (
          inst.dimension === "job" &&
          (requestType === "new" || requestType === "edit")
        ) {
          inst.initClientUpdate.bind(inst)();
        }
      })
      .catch((err) => {
        console.error(err);
      });
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

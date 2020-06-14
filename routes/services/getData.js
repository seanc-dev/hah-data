const lib = require("../../lib/library.js"),
  ss = require("../../lib/spreadsheet.js"),
  mapping = require("../../lib/mapping.js"),
  queries = require("./queries/index");

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

  // dataObjInit: async function(inst, requestType, routeName) {
  // 	console.log(
  // 		`dataObjInit instance dim = ${inst.dimension}, requestType = ${requestType}`,
  // 	);

  // 	return new Promise((resolve, reject) => {
  // 		try {
  // 			resolve(inst.init(requestType));
  // 		} catch (err) {
  // 			console.error(
  // 				`Error in ${inst.dimension} ${requestType} crud service: Failed to initiate instance`,
  // 			);
  // 			console.error(err);
  // 			reject(err);
  // 		}
  // 	});
  // },

  getAddressString: async function (req) {
    return await ss.getAddressDetailsString(
      req.params.orgId,
      req.query.clientId
    );
  },

  getClientDetailsArray: async function (req) {
    return await ss.getClientDetailsArray(req.params.orgId);
  },

  getJobDetailsArray: async function (req) {
    return await ss.getJobDetailsArray(req.params.orgId);
  },

  getKeys: async function (dataObjInst, req, res) {
    let initResult;
    try {
      // call Dataobject.init to return data row
      initResult = await dataObjInst.init("view");
    } catch (err) {
      console.error(
        "Failed to retrieve db record in " +
          dataObjInst.dimension +
          "s index route: keys"
      );
      console.error(err);
      return err;
    }

    // get keys for client record (fieldnames)
    let keysArr = Object.keys(initResult);
    let fieldLabels = [];

    // map in labels from fieldnames and send to client
    for (i = 0; i < keysArr.length; i++) {
      fieldLabels[i] = lib.getFieldLabelFromName(
        mapping[req.params.orgId][dataObjInst.dimension],
        keysArr[i]
      );
    }

    return {
      fieldLabels: fieldLabels,
      fieldNames: keysArr,
    };
  },

  getKeysFromDb: (orgShortName, dim, req, res) => {
    queries
      .getColumnHeaders(dim.toLowerCase())
      .then((result) => {
        console.log(result);
        let obj = {
          fieldLabels: result.map(({ column_name }) => {
            lib.getObjectFromKey(
              orgShortName,
              dim,
              "dbHeader",
              column_name,
              "sheetHeaderName"
            );
          }),
          fieldNames: result.map(({ column_name }) =>
            lib.getObjectFromKey(
              orgShortName,
              dim,
              "dbHeader",
              column_name,
              "fieldName"
            )
          ),
        };
        // console.log(obj);
        res.send(obj);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  },
};

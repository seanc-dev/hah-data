const lib = require("../../lib/library.js"),
    ss = require("../../lib/spreadsheet.js"),
    mapping = require("../../lib/mapping.js");

module.exports = {

    dataObjInit: async function (instance, requestType, routeName) {

        try {
            let data = await instance.init(requestType);
            return data
        } catch (err) {
            console.error("Error in " + instance.dimension + " " + requestType + " dataObjInit service: Failed to initiate instance");
            console.error(err);
            return err;
        }

    },

    getAddressString: async function (req) {
        return await ss.getAddressDetailsString(req.params.orgId, req.query.clientId)
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

            console.error("Failed to retrieve db record in " + dataObjInst.dimension + "s index route: keys");
            console.error(err);
            return err;

        }

        // get keys for client record (fieldnames)
        let keysArr = Object.keys(initResult);
        let fieldLabels = [];

        // map in labels from fieldnames and send to client
        for (i = 0; i < keysArr.length; i++) {
            fieldLabels[i] = lib.getFieldLabelFromName(mapping[req.params.orgId][dataObjInst.dimension], keysArr[i]);
        }

        return {
            fieldLabels: fieldLabels,
            fieldNames: keysArr
        };

    }

}
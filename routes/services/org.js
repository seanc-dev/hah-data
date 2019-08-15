const NodeGeocoder = require('node-geocoder'),
    formOptions = require("../../lib/form-options.js"),
    ss = require("../../lib/spreadsheet.js");

let options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

let geocoder = NodeGeocoder(options);

module.exports = {

    getData: function (orgId) {

        return ss.getClientDetailsArray(orgId)
            .then(function (result) {

                return {
                    clientDetail: result,
                    formOptions: formOptions[orgId],
                    businessName: orgId,
                    businessNameDisplay: orgId[0].toUpperCase() + orgId.slice(1)
                }

            })
            .catch(function (err) {
                console.error("Error in org.getData getClientDetailsArray call");
                console.error(err);
            });

    }

}
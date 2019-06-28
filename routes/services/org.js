const   formOptions = require("../../lib/form-options.js"),
        ss          = require("../../lib/spreadsheet.js");

module.exports = {

    getData: function (orgId) {

        return ss.getClientDetailsArray(orgId)
            .then(function(result){

                return {
                    clientDetail: result,
                    formOptions: formOptions[orgId],
                    businessName: orgId,
                    businessNameDisplay: orgId[0].toUpperCase() + orgId.slice(1)
                }

            })
            .catch(function(err){
                console.error("Error in org.getData getClientDetailsArray call");
                console.error(err);
            });

    }

}
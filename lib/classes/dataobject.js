const   mapping = require("../mapping.js"),
        config  = require("../config.js"),
        ss      = require("../spreadsheet.js");

class DataObject {
    constructor (organisationId, id, type, formData) {

        if(!id) this.generateId();
        this.organisationId = organisationId
        this.dimension = type;
        this.data = formData;
        this.fieldFormulas = [];
        this.worksheetId = config[process.env.ENVIRONMENT]["formTargets"][this.dimension].sheetIndex;
        this.mapping = mapping[this.dimension];
        
    }

    generateId(){

        return ss.getColumnValuesArray(this.worksheetId, 2)
            .then(function(result){

                let data = result.data

                data.sort((a, b) => a - b);
                this._id = data[data.length - 1] + 1

                return this._id

            }.bind(this));

    }

    setRowObject(){

        if(!this._id) return console.error("DataObject instance has no _id")

        ss.getRowsArray(this.worksheetId, this._id, 1)
            .then(function(result){
                
                this.rowObject = result[0];

            }.bind(this));

    }

    updateRowObject(){

        if(!this.rowObject) return console.error("DataObject instance has no rowObject property");

        for (let obj in this.mapping) {

            let fieldName = obj.fieldName,
                APIName = obj.googleRowsAPIName

            if(this.data[fieldName]) this.rowObject[APIName] = this.data[fieldName];

        }

    }

}

module.exports = DataObject;
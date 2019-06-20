const mapping = require("../mapping.js"),
    config = require("../config.js"),
    lib = require("../library.js"),
    ss = require("../spreadsheet.js");

class DataObject {

    constructor(organisationId, id, type, formData) {

        this.organisationId = organisationId
        this.dimension = type;
        if (id) this._id = id;
        this.data = {};
        if (formData) this.data = formData;
        this.fieldFormulas = [];
        this.worksheetId = config[process.env.NODE_ENV][this.organisationId]["formTargets"][this.dimension].sheetIndex;
        this.mapping = mapping[this.dimension];

    }

    appendRow() {

        console.log(this.getDataAPIFriendly());
        ss.addRow(this.organisationId, this.worksheetId, this.getDataAPIFriendly())
            .then((result) => {
                console.log("Successfully appended row to " + this.dimension + "sheet with " + this.dimension + "id: " + this._id);
            })
            .catch((error) => {
                console.error("Failed to append row with id " + this._id + " to " + this.dimension + " sheet.")
            });

    }

    generateId() {

        return ss.getColumnValuesArray(this.organisationId, this.worksheetId, 2)
            .then(function (result) {

                let data = result.data

                data.sort((a, b) => a - b);
                this._id = data[data.length - 1] + 1

                return this._id

            }.bind(this))
            .catch(console.error);

    }

    getDataAPIFriendly() {

        let obj = {}

        for (let key in this.data) {
            obj[lib.getSheetsAPIName(this.mapping, key)] = this.data[key];
        }

        return obj

    }

    getDataFromSheet() {

        if (!this._id) return console.error("DataObject instance has no _id")

        return ss.getRowsArrayDataOnly(this.organisationId, this.dimension, this.mapping, 1, "clientid = " + this._id)
            .then(function(result){

                for (let i = 0; i < this.mapping.length; i++) {

                    let key = this.mapping[i].googleRowsAPIName,
                        value = result[0][key];

                    // test whether return string is currency
                    value = lib.strToNumber(value);

                    let fieldName = lib.getFieldName(this.mapping, key);
                    this.data[fieldName] = value;

                }

                return true;

            }.bind(this))
            .catch(function(err){

                console.log("Error in getDataFromSheet ss.getRowsArrayDataOnly return")
                console.error(err)

            })

    }

    saveRowObject() {

        if (!this.rowObject) return console.error("DataObject instance of type " + this.dimension + " and id " + this._id + " does not have valid rowObject property")

        doWork.bind(this)();

        async function doWork() {

            try {

                await this.rowObject.save();
                console.log("Row object with id " + this._id + " successfully updated in " + this.dimension + " sheet");

            } catch (err) {

                console.log("Error in DataObject.saveRowObject");
                console.error(err)

            }

        }


    }

    setRowObject() {

        if (!this._id) return console.error("DataObject instance has no _id")

        return ss.getRowsArray(this.organisationId, this.worksheetId, 1, this.dimension + "id = " + this._id)
            .then(function (result) {

                this.rowObject = result[0];

                return result[0];

            }.bind(this))
            .catch((err) => {

                console.log("Error in ss.getRowsArray function return in DataObject.setRowObject")
                console.error(err);

            });

    }

    updateRowObject() {

        if (!this.rowObject) return console.error("DataObject instance has no rowObject property");

        for (let i = 0; i < this.mapping.length; i++) {

            let obj = this.mapping[i];

            let fieldName = obj.fieldName,
                APIName = obj.googleRowsAPIName

            if (this.data[fieldName]) this.rowObject[APIName] = this.data[fieldName];

        }

    }

    updateSheetRow() {

        this.setRowObject()
            .then(function (result) {

                this.updateRowObject();
                this.saveRowObject();

            }.bind(this))
            .catch(console.error);

    }

}

module.exports = DataObject;
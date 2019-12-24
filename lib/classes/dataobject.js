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
        this.mapping = mapping[this.organisationId][this.dimension];

    }

    async init(requestType) {

        async function doWork(cb, name) {

            try {
                await cb.bind(this)();
                console.log(requestType + " success for " + this.dimension + " record with id " + this._id);
                return this.data;
            } catch (err) {
                console.error(err);
                console.error("error in this. " + name + " in " + this.dimension + ".init instance with id " + this._id);
                return err;
            }

        }

        doWork = doWork.bind(this);

        if (requestType === "new") {
            let data
            data = await doWork(this.createDBObj, "createDBObj");
            if (this.dimension === "job") {
                this.initClientUpdate();
            }
            return data;
        };
        if (requestType === "edit") return await doWork(this.updateDBObj, "updateDBObj");
        if (requestType === "view") return await doWork(this.getDataFromSheet, "getDataFromSheet");
        if (requestType === "delete") return await doWork(this.deleteDBObj, "deleteDBObj");

    }

    async appendRow() {

        let APIdata = this.getDataAPIFriendly();
        let row
        try {
            row = await ss.addRow(this.organisationId, this.worksheetId, APIdata)
            console.log("Successfully appended row to " + this.dimension + "sheet with " + this.dimension + "id: " + this._id);
            return row;
        } catch (err) {
            console.error(err);
            console.error("Failed to append row with id " + this._id + " to " + this.dimension + " sheet.");
        };

    }

    async createDBObj() {

        // 1. find maximum id in dimension +1 and set as this.data.[dimension]Id = result
        // 2. compute columns
        // 3. append row to sheet and return id

        // retreive id value and set in this.data
        try {
            this.data[this.dimension + "Id"] = await this.generateId.bind(this)();
        } catch (err) {
            console.error(err);
            console.error("Error in this.generateId step in createDBObj for " + this.dimension + " instance with id " + this._id);
        }

        // compute dynamic column values
        let returnVal
        try {
            returnVal = await this.computeColumns.bind(this)();
        } catch (err) {
            console.error(err);
            console.error("Error in this.computeColumns step in createDBObj for " + this.dimension + " instance with id " + this._id);
        }

        // append row to relevant sheet and return result of computeColumns
        try {
            await this.appendRow.bind(this)();
            return returnVal;
        } catch (err) {
            console.error(err);
            console.error("Error in this.appendRow step in createDBObj for " + this.dimension + " instance with id " + this._id);
        }

    }

    async updateDBObj() {

        //  1. Retrieve DB data, save as this.rowObject
        //  2. Compute additional fields from this.data
        //  3. Update this.rowObject with this.data static and computed fields
        //  4. Save updated this.rowObject to DB

        // if this.data not populated, run this.getDataFromSheet (this is in the case that the update will only be to computed columns)
        try {
            if (this.data === {}) {
                await this.getDataFromSheet();
            }
        } catch (err) {
            console.error(err);
            console.error("Error in this.getDataFromSheet step in updateDBObj for " + this.dimension + " instance with id " + this._id)
        }

        // populate this.rowObject from sheet
        try {
            await this.getRowObject();
        } catch (err) {
            console.error(err);
            console.error("Error in " + this.dimension + ".getDataFromSheet return")
        }

        // run this.computeColumns
        try {
            await this.computeColumns();
        } catch (err) {
            console.error("Error in compute columns in " + this.dimension + " constructor")
            console.error(err);
        }

        // update this.rowObject to match mapped fields from this.data and save to database.
        try {
            await this.updateSheetRow();
            console.log("Successfully updated record with id " + this._id + " in " + this.dimension + " sheet")
        } catch (err) {
            console.error("Error in updateSheetRow in " + this.dimension + " constructor")
            console.error(err);
        }

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

    async getDataFromSheet() {

        // this formula retrieves the requisite row data from the DB and formats it as this.data 
        // - (a format which can be sent to the client)

        if (!this._id) return console.error("DataObject instance has no _id");

        let rowsArr;
        // retrieve row object from DB
        try {
            rowsArr = await ss.getRowsArrayDataOnly(this.organisationId, this.dimension, this.mapping, 1, this.dimension + "id = " + this._id);
        } catch (err) {
            console.error("Error in getDataFromSheet ss.getRowsArrayDataOnly return");
            console.error(err);
        }

        for (let i = 0; i < this.mapping.length; i++) {

            let key = this.mapping[i].googleRowsAPIName,
                value = rowsArr[0][key];

            // test whether return string is currency
            value = lib.strToNumber(value);

            let fieldName = lib.getFieldName(this.mapping, key);
            this.data[fieldName] = value;

        }

        return this.data;

    }

    async deleteDBObj() {

        // this formula deletes this.rowObject's corresponding DB row object.
        if (!this.rowObject) return console.error(this.dimension + " instance with id " + this._id + " does not have valid rowObject property")

        try {
            await this.rowObject.del();
            return console.log("Row with id " + this._id + " successfully deleted in " + this.dimension + " sheet");
        } catch (err) {
            console.error("Error in Dataobject.deleteDBObj");
            console.error(err)
        }

    }

    getRowObject() {

        // this formula retrieves the requisite DB row object and sets it as this.rowObject

        if (!this._id) return console.error(this.dimension + " instance has no _id")

        return ss.getRowsArray(this.organisationId, this.worksheetId, 1, this.dimension + "id = " + this._id)
            .then(function (result) {

                this.rowObject = result[0];

                return result[0];

            }.bind(this))
            .catch((err) => {

                console.error("Error in ss.getRowsArray function return in DataObject.getRowObject")
                console.error(err);

            });

    }

    saveRowObject() {

        // this function sets the value of the DB row to the values of this.rowObject.

        if (!this.rowObject) return console.error("DataObject instance of type " + this.dimension + " and id " + this._id + " does not have valid rowObject property")

        doWork.bind(this)();

        async function doWork() {

            try {

                await this.rowObject.save();
                console.log("Row object with id " + this._id + " successfully updated in " + this.dimension + " sheet");

            } catch (err) {

                console.error("Error in DataObject.saveRowObject");
                console.error(err)

            }

        }


    }

    updateRowObject() {

        // this formula updates this.rowObject to equal this.data, where the relevant fields exist in this.data
        // N.B. any fields present in this.rowObject (e.g. from previously running this.getRowObject) which are 
        //  not present (in their mapping) in this.data will not be updated. This means that a field removed 
        //  from the form will not be cleared by default with the edit functionality.

        if (!this.rowObject) return console.error("DataObject instance has no rowObject property");

        for (let i = 0; i < this.mapping.length; i++) {

            let fieldName = this.mapping[i].fieldName,
                APIName = this.mapping[i].googleRowsAPIName

            if (this.data[fieldName]) this.rowObject[APIName] = this.data[fieldName];

        }

    }

    updateSheetRow() {

        this.getRowObject()
            .then(function (result) {

                this.updateRowObject();
                this.saveRowObject();

            }.bind(this))
            .catch(console.error);

    }

}

module.exports = DataObject;
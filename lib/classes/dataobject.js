/*  ******************************************************************************  */
//  DataObject class
//  - super for Client and Job classes, contains most of the logic for crud operations
//  Flow:
//  -

const moment = require("moment-timezone");

const mapping = require("../mapping.js"),
  config = require("../config.js"),
  lib = require("../library.js"),
  ss = require("../spreadsheet.js");

class DataObject {
  constructor(organisationId, id, type, formData) {
    this.organisationId = organisationId;
    this.dimension = type;
    if (id) this._id = id;
    this.data = {};
    if (formData) this.data = formData;
    this.fieldFormulas = [];
    this.worksheetId =
      config[process.env.NODE_ENV][this.organisationId]["formTargets"][
        this.dimension
      ].sheetIndex;
    this.mapping = mapping[this.organisationId][this.dimension];
  }

  /** init: DataObject method
   * - creates object, attaches data and performs manipulations according to the requestType parameter passed
   * - takes requestType parameter ('new', 'view', 'edit', 'delete')
   * - returns promise from result of callback
   * - if dimension is job and requestType is not 'view', sets timeout to run Job.initClientUpdate
   */
  init(requestType) {
    let doWork = function (cb, name) {
      let pr = new Promise((resolve, reject) => {
        cb = cb
          .bind(this)()
          .then((result) => {
            console.log(
              `${requestType.toUpperCase()} success for ${this.dimension.toUpperCase()} record with id ${
                this._id
              }`
            );
            resolve(result);
          })
          .catch((err) => {
            console.error(err);
            console.error(
              `Error in this. ${name} in ${this.dimension.toUpperCase()}.init instance with id ${
                this._id
              }`
            );
            reject(err);
          });
      });

      return pr;
    }.bind(this);

    if (requestType === "new") return doWork(this.createDBObj, "createDBObj");
    if (requestType === "edit") return doWork(this.updateDBObj, "updateDBObj");
    if (requestType === "view")
      return doWork(this.getDataFromSheet, "getDataFromSheet");
    if (requestType === "delete")
      return doWork(this.deleteDBObj, "deleteDBObj");
  }

  convertAndFormatDates() {
    const keys = Object.keys(this.data);
    keys.forEach((key) => {
      let val = this.data[key];
      // convert and reformat date values from nzt
      if (
        moment(val, "YYYY-MM-DDTHH:mm:ssZ", true).isValid() ||
        moment(val, "D/M/YYYY", true).isValid() ||
        moment(val, "YYYY-MM-DD", true).isValid()
      )
        val = moment(val).tz("Pacific/Auckland").format("YYYY-MM-DD HH:mm:ss");
      this.data[key] = val;
    });
  }

  async createDBObj() {
    console.log(`createDBObj running for ${this.dimension} dim`);

    // 1. append id to this.data dimension id
    // 2. compute columns
    // 3. append row to sheet and return id

    this.data[this.dimension + "Id"] = this._id;

    try {
      await this.getDataFromDb.bind(this)();
    } catch (err) {
      console.error(err);
      console.error(
        "Error in this.getDataFromDb step in createDBObj for " +
          this.dimension +
          " instance with id " +
          this._id +
          " for org " +
          this.organisationId
      );
    }

    // // compute dynamic column values
    // try {
    //   await this.computeColumns();
    //   console.log(`this.computeColumns run`);
    //   console.log(this.data);
    // } catch (err) {
    //   console.error(err);
    // }

    // append row to relevant sheet and return result of computeColumns
    try {
      await this.appendRow.bind(this)();
      return this._id;
    } catch (err) {
      console.error(err);
      console.error(
        "Error in appendRow step in createDBObj for " +
          this.dimension +
          " instance with id " +
          this._id
      );
    }

    return this._id;
  }

  async appendRow() {
    console.log(`appendRow running for ${this.dimension} dim`);

    let data = {};
    for (let key in this.data) {
      data[lib.getFieldLabelFromName(this.mapping, key)] = this.data[key];
    }

    try {
      const row = await ss.addRow(
        this.organisationId,
        this.worksheetId - 1,
        data
      );
      console.log(
        "Successfully appended row to " +
          this.dimension +
          "sheet with " +
          this.dimension +
          "id: " +
          this._id
      );
      return row;
    } catch (err) {
      console.error(err);
      console.error(
        "Failed to append row with id " +
          this._id +
          " to " +
          this.dimension +
          " sheet."
      );
    }
  }

  // getDataAPIFriendly() {
  //   let obj = {};

  //   for (let key in this.data) {
  //     obj[lib.getSheetsAPIName(this.mapping, key)] = this.data[key];
  //   }

  //   return obj;
  // }

  async updateDBObj() {
    //  1. Retrieve DB data, save as this.rowObject
    //  2. Compute additional fields from this.data
    //  3. Update this.rowObject with this.data static and computed fields
    //  4. Save updated this.rowObject to DB

    // if this.data not populated, run this.getDataFromSheet (this is in the case that the update will only be to computed columns)
    if (
      !this.data ||
      !Object.keys(this.data).length ||
      Object.keys(this.data).length < 1
    ) {
      try {
        await this.getDataFromDb.bind(this)();
        // await this.getDataFromSheet();
      } catch (err) {
        console.error(err);
        console.error(
          "Error in this.getDataFromSheet step in updateDBObj for " +
            this.dimension +
            " instance with id " +
            this._id
        );
      }
    }

    try {
      await this.computeColumns();
    } catch (err) {
      console.error(err);
    }

    try {
      await this.updateSheetRow();
      console.log(
        "Successfully updated record with id " +
          this._id +
          " in " +
          this.dimension +
          " sheet"
      );
    } catch (err) {
      console.error("Error in updateSheetRow in " + this.dimension);
      console.error(err);
    }

    return this.data;
  }

  generateId() {
    return ss
      .getColumnValuesArray(this.organisationId, this.worksheetId, 2)
      .then(
        function (result) {
          let data = result.data;

          data.sort((a, b) => a - b);
          this._id = data[data.length - 1] + 1;

          return this._id;
        }.bind(this)
      )
      .catch(console.error);
  }

  async getDataFromSheet() {
    // this formula retrieves the instance's row data from the DB and formats it as this.data
    // (this.data is in a format which can be sent to the client)

    if (!this._id) return console.error("DataObject instance has no _id");

    let rowsArr;
    try {
      // retrieve array of row objects from DB
      rowsArr = await ss.getRowsArrayDataOnly(
        this.organisationId,
        this.dimension,
        this.mapping,
        1,
        this.dimension + "id = " + this._id
      );
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
    if (!this.rowObject)
      return console.error(
        this.dimension +
          " instance with id " +
          this._id +
          " does not have valid rowObject property"
      );

    try {
      await this.rowObject.del();
      console.log(
        `Row with id ${
          this._id
        } successfully deleted in ${this.dimension.toUpperCase()} sheet`
      );
      return this.data;
    } catch (err) {
      console.error("Error in Dataobject.deleteDBObj");
      console.error(err);
      return err;
    }
  }

  async getRowObject() {
    console.log(`${this.dimension}.getRowObject`);
    // this formula retrieves the requisite DB row object and sets it as this.rowObject
    if (!this._id)
      return console.error(this.dimension + " instance has no _id");

    try {
      const rowObj = await ss.getRowsArray(
        this.organisationId,
        this.worksheetId - 1,
        1,
        [this._id]
      );
      console.log(`${this.dimension}.getRowObject ss.getRowsArray func called`);
      this.rowObject = rowObj[0];
      return this.rowObject;
    } catch (err) {
      console.error(
        "Error in ss.getRowsArray function return in DataObject.getRowObject"
      );
      console.error(err);
    }
  }

  async saveRowObject() {
    // this function sets the value of the DB row to the values of this.rowObject.

    // ensure row object available
    if (!this.rowObject) {
      console.error(
        "DataObject instance of type " +
          this.dimension +
          " and id " +
          this._id +
          " does not have valid rowObject property. DataObject.getRowObject initiated."
      );
    }

    // save row object
    try {
      await this.rowObject.save();
      console.log(
        "Row object with id " +
          this._id +
          " successfully updated in " +
          this.dimension +
          " sheet"
      );
    } catch (err) {
      console.error("Error in DataObject.saveRowObject");
      console.error(err);
    }
  }

  async updateRowObject() {
    console.log(`${this.dimension}.updateRowObject`);
    // this formula updates this.rowObject to equal this.data, where the relevant fields exist in this.data
    // N.B. any fields present in this.rowObject (e.g. from previously running this.getRowObject) which are
    //  not present (in their mapping) in this.data will not be updated. This means that a field removed
    //  from the form will not be cleared by default with the edit functionality.

    if (!this.rowObject) {
      try {
        await this.getRowObject();
      } catch (err) {
        console.error(err);
        return console.error(
          `Error in updateRowObject function for ${this.organisationId} org, dim ${this.dimension}, id ${this._id} as rowObject not present on instance`
        );
      }
    }

    for (let i = 0; i < this.mapping.length; i++) {
      let sheetHeaderName = this.mapping[i].sheetHeaderName;
      let fieldName = this.mapping[i].fieldName;
      if (this.data[fieldName])
        this.rowObject[sheetHeaderName] = this.data[fieldName];
    }
  }

  async updateSheetRow() {
    console.log(`${this.dimension}.updateSheetRow`);
    await this.getRowObject();
    await this.updateRowObject();
    await this.saveRowObject();
  }
}

module.exports = DataObject;

const   GoogleSpreadsheet   = require("google-spreadsheet");

const   config              = require("./config.js");
const   mapping             = require("./mapping.js");

const   creds               = process.env.GOOGLE_APPLICATION_CREDENTIALS//require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

console.log(creds);

module.exports = {

    addRow: function(organisationId, worksheetId, newRowObj){

        const doc = new GoogleSpreadsheet(config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]);

        return new Promise((resolve, reject) => {

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {

                if (err) reject(err);

                doc.addRow(worksheetId, newRowObj, function(err, row){

                    if (err) reject(err);

                    resolve(row);

                });

            });

        });

    },

    getAddressDetailsArray: function(organisationId, clientId){

        return new Promise((resolve, reject) => {

            // pull address details for client
            this.getRowsXCellsArray(organisationId, 1, clientId, clientId, [10,11])
            .then(function(result){
                console.log(result.data[0]);
                resolve(result.data[0]);
            })
            .catch(reject);

        });

    },

    getCellsArray: function(organisationId, workSheetIndex, cellIndexArray){

        const doc = new GoogleSpreadsheet(config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]);

        return new Promise((resolve, reject) => {
            
            cellIndexArray = cellIndexArray.sort((a, b) => a - b);

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // get all cells in range
                doc.getCells(workSheetIndex, {
                    'min-col': cellIndexArray[0],
                    'max-col': cellIndexArray[cellIndexArray.length-1]
                }, function (err, cells) {

                    if(err || !cells || cells.length < 0) reject(err || new Error("Cells array returned empty"));

                    let obj = {
                        headers: [],
                        data: []
                    };
                    let filtered = cells.reduce((acc, val, i) => {
                        
                        // if current column is included in parameters, continue
                        if(cellIndexArray.includes(val.col)) {
                            // if this is header row, add data to headers array
                            if(val.row == 1) {
                                if(val.col == cellIndexArray[0]) acc.headers.push([]);
                                acc.headers[acc.headers.length-1].push(val._numericValue || val._value);
                            // else add to data
                            } else {
                                if(val.col == cellIndexArray[0]) acc.data.push([]);
                                acc.data[acc.data.length-1].push(val._numericValue || val._value);
                            }
                        }
                        return acc;
                    }, obj);

                    resolve(filtered);

                });

            });

        });

    },

    getClientDetailsArray: function(organisationId){

        return new Promise((resolve, reject) => {

            // get client details and account names
            let objectArray;

            this.getCellsArray(organisationId, 1, [2,3])
                .then(function(result){

                    // reorganise returned data into array of objects with props clientId and accountName
                    objectArray = result.data.map(function(val, i){
                        return {
                            clientId: val[0],
                            accountName: val[1]
                        }
                    });

                    resolve(objectArray);

                })
                .catch(reject);

        });
            
    },

    getColumnValuesArray: function(organisationId, workSheetIndex, cellIndex){

        const doc = new GoogleSpreadsheet(config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]);

        return new Promise((resolve, reject) => {

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // get all cells in range
                doc.getCells(workSheetIndex, {
                    'min-col': cellIndex,
                    'max-col': cellIndex
                }, function (err, cells) {

                    if(err) reject(err);

                    let obj = {
                        headers: [],
                        data: []
                    };
                    let filtered = cells.reduce((acc, val, i) => {
                        
                        // if this is header row, add data to headers array
                        if(val.row == 1) {
                            acc.headers.push(val._numericValue || val._value);
                        // else add to data
                        } else {
                            acc.data.push(val._numericValue || val._value);
                        }

                        return acc;

                    }, obj);

                    resolve(filtered);

                });

            });

        });

    },

    getRowsArray: function (organisationId, workSheetIndex, rowStart, query) {

        const doc = new GoogleSpreadsheet(config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]);

        return new Promise((resolve, reject) => {

            // Authenticate with the Google Spreadsheets API
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // retrieve rows and call callback with resolve value
                doc.getRows(workSheetIndex, {
                    offset: rowStart,
                    query: query,
                    orderby: 2 // in Client sheet this is clientId, in Jobs sheet it is jobId
                }, function(err, rows) {

                    if (err) reject(err);

                    resolve(rows);

                });

            });

        });

    },

    getRowsArrayDataOnly: function (organisationId, dimension, mapping, rowStart, query) {

        const   sheetIndex  = config[process.env.NODE_ENV][organisationId]["formTargets"][dimension].sheetIndex,
                doc         = new GoogleSpreadsheet(config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]);

        return new Promise((resolve, reject) => {

            // Authenticate with the Google Spreadsheets API
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // retrieve rows and call callback with resolve value
                doc.getRows(sheetIndex, {
                    offset: rowStart,
                    query: query,
                    orderby: 2 // in Client sheet this is clientId, in Jobs sheet it is jobId
                }, function(err, rows) {

                    if (err) reject(err);

                    // pull out column data and apply to objects in new array
                    let newRowsArr = rows.map((val, i) => {

                        let obj = {}

                        for (let i = 0; i < mapping.length; i++){

                            let key = mapping[i].googleRowsAPIName
                            
                            if (val[key]) obj[key] = val[key];

                        }

                        return obj;

                    })

                    resolve(newRowsArr);

                });

            });

        });

    },

    getRowsXCellsArray: function(organisationId, workSheetIndex, rowMin, rowMax, cellIndexArray){

        const doc = new GoogleSpreadsheet(config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]);

        return new Promise((resolve, reject) => {
            
            cellIndexArray = cellIndexArray.sort((a, b) => a - b);

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // get all cells in range
                doc.getCells(workSheetIndex, {
                    'min-col': cellIndexArray[0],
                    'max-col': cellIndexArray[cellIndexArray.length-1],
                    'min-row': rowMin,
                    'max-row': rowMax
                }, function (err, cells) {

                    if(err) reject(err);

                    let obj = {
                        headers: [],
                        data: []
                    };
                    let filtered = cells.reduce((acc, val, i) => {
                        
                        // if current column is included in parameters, continue
                        if(cellIndexArray.includes(val.col)) {
                            // if this is header row, add data to headers array
                            if(val.row == 1) {
                                if(val.col == cellIndexArray[0]) acc.headers.push([]);
                                acc.headers[acc.headers.length-1].push(val._numericValue || val._value);
                            // else add to data
                            } else {
                                if(val.col == cellIndexArray[0]) acc.data.push([]);
                                acc.data[acc.data.length-1].push(val._numericValue || val._value);
                            }
                        }
                        return acc;
                    }, obj);

                    resolve(filtered);

                });

            });

        });

    }

}
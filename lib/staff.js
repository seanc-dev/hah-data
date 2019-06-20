module.exports = {
    kapiti: {
        staffNames: ["Dave", "Westy", "Pete", "Boof"],
        mapping: [{
                sheetHeaderName: "Effective Date",
                fieldName: "hourlyRateEffectiveDate",
                googleRowsAPIName: "effectivedate"
            },
            {
                sheetHeaderName: "Dave Hours",
                fieldName: "hoursWorkedDave",
                googleRowsAPIName: "davehours"
            },
            {
                sheetHeaderName: "Dave Hourly Rate",
                fieldName: "hourlyRateDave",
                googleRowsAPIName: "davehourlyrate"
            },
            {
                sheetHeaderName: "Westy Hours",
                fieldName: "hoursWorkedWesty",
                googleRowsAPIName: "westyhours"
            },
            {
                sheetHeaderName: "Westy Hourly Rate",
                fieldName: "hourlyRateWesty",
                googleRowsAPIName: "westyhourlyrate"
            },
            {
                sheetsLabel: "Pete Hours",
                fieldName: "hoursWorkedPete",
                googleRowsAPIName: "petehours"
            },
            {
                sheetsLabel: "Pete Hourly Rate",
                fieldName: "hourlyRatePete",
                googleRowsAPIName: "petehourlyrate"
            },
            {
                sheetsLabel: "Boof Hours",
                fieldName: "hoursWorkedBoof",
                googleRowsAPIName: "boofhours"
            },
            {
                sheetsLabel: "Boof Hourly Rate",
                fieldName: "hourlyRateBoof",
                googleRowsAPIName: "boofhourlyrate"
            }
        ]
    },
    wellington: {
        staffNames: ["James", "Darryl"],
        mapping: [{
                sheetHeaderName: "Effective Date",
                fieldName: "hourlyRateEffectiveDate",
                googleRowsAPIName: "effectivedate"
            },
            {
                sheetHeaderName: "James Hours",
                fieldName: "hoursWorkedJames",
                googleRowsAPIName: "jameshours"
            },
            {
                sheetHeaderName: "James Hourly Rate",
                fieldName: "hourlyRateJames",
                googleRowsAPIName: "jameshourlyrate"
            },
            {
                sheetHeaderName: "Darryl Hours",
                fieldName: "hoursWorkedDarryl",
                googleRowsAPIName: "darrylhours"
            },
            {
                sheetHeaderName: "Darryl Hourly Rate",
                fieldName: "hourlyRateDarryl",
                googleRowsAPIName: "darrylhourlyrate"
            }
        ]
    }
}
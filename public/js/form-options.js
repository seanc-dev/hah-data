const data = {
    business: "kapiti",
    formData: {
        clientDetails: {
            restfulName: "clients",
            structure: [{
                    sectionTitle: "Identity and Contact Details",
                    fields: [
                        ["cd_accountType", "cd_accountName"],
                        ["cd_businessName", "cd_createdDateTimeNZT"],
                        ["cd_mainContactFirstName", "cd_mainContactLastName"],
                        ["cd_secondaryContactFirstName", "cd_secondaryContactLastName"],
                        ["cd_mainContactLandline", "cd_mainContactMobile"],
                        ["cd_mainContactEmail"]
                    ]
                },
                {
                    sectionTitle: "Address Details",
                    fields: [
                        ["cd_billingAddressStreet", "cd_billingAddressSuburb"],
                        ["cd_territory"]
                    ]
                },
                {
                    sectionTitle: "Marketing Details",
                    fields: [
                        ["cd_customerDemographic", "cd_estimatedCustomerIncome"],
                        ["cd_acquisitionChannel"]
                    ]
                }
            ],
            fields: {
                cd_createdDateTimeNZT: {
                    label: "",
                    fieldName: "createdDateTimeNZT",
                    fieldType: "hidden",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["d-none"]
                },
                cd_accountType: {
                    label: "Account Type",
                    fieldName: "accountType",
                    fieldType: "select",
                    values: ["", "Single", "Couple", "Business"],
                    readOnly: 0,
                    isRequired: 1,
                    submitExclude: 1,
                    additionalClasses: ["account-name"]
                },
                cd_accountName: {
                    label: "Account Name",
                    fieldName: "accountName",
                    fieldType: "Text",
                    readOnly: 1,
                    isRequired: 1
                },
                cd_mainContactFirstName: {
                    label: "Main Contact First Name",
                    fieldName: "mainContactFirstName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1,
                    additionalClasses: ["account-name"]
                },
                cd_mainContactLastName: {
                    label: "Main Contact Last Name",
                    fieldName: "mainContactLastName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1,
                    additionalClasses: ["account-name"]
                },
                cd_secondaryContactFirstName: {
                    label: "Secondary Contact First Name",
                    fieldName: "secondaryContactFirstName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 0,
                    submitExclude: 1,
                    additionalClasses: ["account-name"]
                },
                cd_secondaryContactLastName: {
                    label: "Secondary Contact Last Name",
                    fieldName: "secondaryContactLastName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 0,
                    submitExclude: 1,
                    additionalClasses: ["account-name"]
                },
                cd_mainContactEmail: {
                    label: "Main Contact Email",
                    fieldName: "mainContactEmail",
                    fieldType: "Email",
                    readOnly: 0,
                    isRequired: 0
                },
                cd_mainContactLandline: {
                    label: "Main Contact Landline",
                    fieldName: "mainContactLandline",
                    fieldType: "tel",
                    readOnly: 0,
                    isRequired: 0
                },
                cd_mainContactMobile: {
                    label: "Main Contact Mobile",
                    fieldName: "mainContactMobile",
                    fieldType: "tel",
                    readOnly: 0,
                    isRequired: 0
                },
                cd_businessName: {
                    label: "Business Name",
                    fieldName: "businessName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["account-name"]
                },
                cd_billingAddressStreet: {
                    label: "Billing Street Address",
                    fieldName: "billingAddressStreet",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_billingAddressSuburb: {
                    label: "Billing Address Suburb",
                    fieldName: "billingAddressSuburb",
                    fieldType: "select",
                    values: ["", "Paraparaumu", "Paraparaumu Beach", "Raumati Beach", "Raumati South", "Otaihanga", "Waikanae", "Waikanae Beach"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_billingAddressCity: {
                    label: "Billing Address City",
                    fieldName: "billingAddressCity",
                    fieldType: "datalist",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_territory: {
                    label: "Territory",
                    fieldName: "territory",
                    fieldType: "select",
                    values: ["", "Raumati", "Waikanae"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_customerDemographic: {
                    label: "Customer Demographic",
                    fieldName: "customerDemographic",
                    fieldType: "select",
                    values: ["", "Old Retiree", "Active Retiree", "Baby Boomer (50-65 ish)", "Professional Couple", "Professional Single", "Young Family", "Property Management Company", "Private Landlord", "Other Business"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_estimatedCustomerIncome: {
                    label: "Estimated Customer Income",
                    fieldName: "estimatedCustomerIncome",
                    fieldType: "select",
                    values: ["", "Pension", "$0-$30k", "$30,001 - $50,000", "$50,001 - $70,000", "$70,001 - $90,000", "$90,001+"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_acquisitionChannel: {
                    label: "How did they come to us?",
                    fieldName: "acquisitionChannel",
                    fieldType: "select",
                    values: ["", "Referral from Partner Business", "Word of Mouth", "Vehicle Signage", "Print Campaign (HAH Kapiti)", "Print Advertising (HAH Kapiti - BAU)", "Online Referral (HAH National - BAU)", "Facebook Advertising (HAH National - BAU)", "Facebook Advertising (HAH Kapiti - BAU)", "Facebook Campaign (HAH Kapiti)", "Other Marketing Campaign (HAH National)", "Flyer Drop", "Gift Voucher", "Sweet Louise Voucher"],
                    readOnly: 0,
                    isRequired: 1
                }
            }
        },
        jobDetails: {
            restfulName: "jobs",
            structure: [{
                    sectionTitle: "Account and Location Details",
                    fields: [
                        ["jd_accountName", "jd_billingAddress"],
                        ["jd_workLocationStreetAddress", "jd_workLocationSuburb"]
                    ]
                },
                {
                    sectionTitle: "Job Type and Date Details",
                    fields: [
                        ["jd_primaryJobType", "jd_secondaryJobType"],
                        ["jd_indoorsOutdoors", "jd_createdDateTimeNZT"],
                        ["jd_dateJobEnquiry", "jd_dateJobQuoted"],
                        ["jd_dateWorkCommenced", "jd_dateInvoiceSent"]
                    ]
                },
                {
                    sectionTitle: "Job Cost Details",
                    fields: [
                        ["jd_invoiceAmount", "jd_materialsCost"],
                        ["jd_costSubcontractor", "jd_tipFeesCost"],
                        ["jd_costOther"],
                        ["jd_daveHours", "jd_westyHours"],
                        ["jd_peteHours", "jd_boofHours"]
                    ]
                },
                {
                    sectionTitle: "Job Feedback",
                    fields: [
                        ["jd_workSatisfaction", "jd_clientId"]
                    ]
                }
            ],
            fields: {
                jd_createdDateTimeNZT: {
                    label: "",
                    fieldName: "createdDateTimeNZT",
                    fieldType: "hidden",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["d-none"]
                },
                jd_accountName: {
                    label: "Account Name",
                    fieldName: "accountName",
                    fieldType: "datalist",
                    values: ["Test"],
                    readOnly: 0,
                    isRequired: 1,
                    validationDetail: "Give all unique existing values as options, sorted alphabetically. Do not allow new values to be entered"
                },
                jd_clientId: {
                    label: "",
                    fieldName: "clientId",
                    fieldType: "hidden",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["d-none"],
                    validationDetail: "Lookup from client details sheet, column B, using accountName field to match to value in column C"
                },
                jd_billingAddress: {
                    label: "Billing Address",
                    fieldName: "billingAddress",
                    fieldType: "textarea",
                    readOnly: 1,
                    isRequired: 0,
                    submitExclude: 1,
                    validationDetail: "Value from client details sheet, field billingStreetAddress (column J) to be populated as static text (this will help the user to understand whether they have selected the correct accountName value in field 1)"
                },
                jd_workLocationStreetAddress: {
                    label: "Street Adress Where Work Completed",
                    fieldName: "workLocationStreetAddress",
                    fieldType: "text",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_workLocationSuburb: {
                    label: "Suburb Where Work Completed",
                    fieldName: "workLocationSuburb",
                    fieldType: "select",
                    values: ["", "Paraparaumu", "Raumati Beach", "Raumati South", "Otaihanga", "Waikanae", "Waikanae Beach"],
                    readOnly: 0,
                    isRequired: 0
                },
                jd_primaryJobType: {
                    label: "Primary Job Type",
                    fieldName: "primaryJobType",
                    fieldType: "select",
                    values: ["", "Maintenance", "Painting", "Fencing", "Paving", "Gardening", "Deck", "Installation", "Bathroom Reno", "Kitchen Reno", "Laundry Reno", "Sub-Contractor", "Rubbish Removal", "Furniture Removal", "Other Landscaping", "Other Carpentry", "Plaster Repairs"],
                    readOnly: 0,
                    isRequired: 1
                },
                jd_secondaryJobType: {
                    label: "Seconday Job Type",
                    fieldName: "secondaryJobType",
                    fieldType: "select",
                    values: ["", "Maintenance", "Painting", "Fencing", "Paving", "Gardening", "Deck", "Installation", "Bathroom Reno", "Kitchen Reno", "Laundry Reno", "Sub-Contractor", "Rubbish Removal", "Furniture Removal", "Other Landscaping", "Other Carpentry", "Plaster Repairs"],
                    readOnly: 0,
                    isRequired: 0
                },
                jd_indoorsOutdoors: {
                    label: "Indoors or Outdoors",
                    fieldName: "indoorsOutdoors",
                    fieldType: "select",
                    values: ["", "Indoors", "Outdoors"],
                    readOnly: 0,
                    isRequired: 1
                },
                jd_dateJobEnquiry: {
                    label: "Date of Job Enquiry",
                    fieldName: "dateJobEnquiry",
                    fieldType: "date",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_dateJobQuoted: {
                    label: "Date Job Quoted",
                    fieldName: "dateJobQuoted",
                    fieldType: "date",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_dateWorkCommenced: {
                    label: "Date Work Commenced",
                    fieldName: "dateWorkCommenced",
                    fieldType: "date",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_dateInvoiceSent: {
                    label: "Date Invoice Sent",
                    fieldName: "dateInvoiceSent",
                    fieldType: "date",
                    readOnly: 0,
                    isRequired: 1
                },
                jd_invoiceAmount: {
                    label: "Amount Invoiced (excl. GST)",
                    fieldName: "invoiceAmount",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 1
                },
                jd_materialsCost: {
                    label: "Materials Cost",
                    fieldName: "materialsCost",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_tipFeesCost: {
                    label: "Tip Fees",
                    fieldName: "tipFeesCost",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_costSubcontractor: {
                    label: "Sub-Contractor Cost",
                    fieldName: "costSubcontractor",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_costOther: {
                    label: "Other Cost (Excluding Staff Cost)",
                    fieldName: "costOther",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_daveHours: {
                    label: "Dave Hours",
                    fieldName: "daveHours",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["staff-hours"],
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_westyHours: {
                    label: "Westy Hours",
                    fieldName: "westyHours",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["staff-hours"],
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_peteHours: {
                    label: "Pete Hours",
                    fieldName: "peteHours",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["staff-hours"],
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_boofHours: {
                    label: "Boof Hours",
                    fieldName: "boofHours",
                    fieldType: "number",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["staff-hours"],
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_workSatisfaction: {
                    label: "Satisfaction With Work?",
                    fieldName: "workSatisfaction",
                    fieldType: "select",
                    values: ["", 5, 4, 3, 2, 1],
                    readOnly: 0,
                    isRequired: 1
                }
            }
        }
    }
}


export default data
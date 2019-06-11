const data = {
    business: "kapiti",
    formData: {
        clientDetails: {
            structure: [{
                    sectionTitle: "Identity and Contact Details",
                    fields: [
                        ["cd_accountType", "cd_accountName"],
                        ["cd_businessName"],
                        ["cd_mainContactFirstName", "cd_mainContactLastName"],
                        ["cd_secondaryContactFirstName", "cd_secondaryContactLastName"],
                        ["cd_mainContactLandline", "cd_mainContactMobile"],
                        ["cd_mainContactEmail"]
                    ]
                },
                {
                    sectionTitle: "Address Details",
                    fields: [
                        ["cd_billingAddressStreetNumber", "cd_billingAddressStreetName"],
                        ["cd_billingAddressSuburb", "cd_billingAddressPostCode"],
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
                cd_accountType: {
                    label: "Account Type",
                    fieldName: "accountType",
                    fieldType: "select",
                    values: ["", "Single", "Couple", "Business"],
                    readOnly: 0,
                    isRequired: 1,
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
                    isRequired: 1,
                    additionalClasses: ["account-name"]
                },
                cd_secondaryContactLastName: {
                    label: "Secondary Contact Last Name",
                    fieldName: "secondaryContactLastName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1,
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
                    isRequired: 0,
                    pattern: /^[\+]?[(]?[0-9]{2}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im
                },
                cd_mainContactMobile: {
                    label: "Main Contact Mobile",
                    fieldName: "mainContactMobile",
                    fieldType: "tel",
                    readOnly: 0,
                    isRequired: 0,
                    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                },
                cd_businessName: {
                    label: "Business Name",
                    fieldName: "businessName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 0,
                    additionalClasses: ["account-name"]
                },
                cd_billingAddressStreetNumber: {
                    label: "Billing Address Street Number",
                    fieldName: "billingAddressStreetNumber",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_billingAddressStreetName: {
                    label: "Billing Address Street Name",
                    fieldName: "billingAddressStreetName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_billingAddressPostCode: {
                    label: "Billing Address Post Code",
                    fieldName: "billingAddressPostCode",
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
                },
            }
        },
        jobDetails: {
            structure: [{
                    sectionTitle: "Account and Location Details",
                    fields: [
                        ["jd_accountName", "jd_billingStreetAddress"],
                        ["jd_workLocationStreetAddress", "jd_workLocationSuburb"]
                    ]
                },
                {
                    sectionTitle: "Job Type and Date Details",
                    fields: [
                        ["jd_primaryJobType", "jd_secondaryJobType"],
                        ["jd_indoorsOutdoors"],
                        ["jd_dateJobEnquiry", "jd_dateJobQuoted"],
                        ["jd_dateInvoiceSent"]
                    ]
                },
                {
                    sectionTitle: "Job Cost Details",
                    fields: [
                        ["jd_invoiceAmount", "jd_materialsCost"],
                        ["jd_costSubcontractor", "jd_costOther"],
                        ["jd_daveHours", "jd_westyHours"],
                        ["jd_boofHours", "jd_workSatisfaction"],
                        ["jd_boofHours"]
                    ]
                },
                {
                    sectionTitle: "Job Feedback",
                    fields: [
                        ["jd_workSatisfaction"]
                    ]
                }
            ],
            fields: {
                jd_accountName: {
                    label: "Account Name",
                    name: "accountName",
                    type: "datalist",
                    readOnly: 0,
                    isRequired: 1,
                    validationDetail: "Give all unique existing values as options, sorted alphabetically. Do not allow new values to be entered"
                },
                jd_clientId: {
                    label: "",
                    name: "clientId",
                    type: "hidden",
                    readOnly: 0,
                    isRequired: 1,
                    additionalClasses: ["d-none"],
                    validationDetail: "Lookup from client details sheet, column B, using accountName field to match to value in column C"
                },
                jd_billingStreetAddress: {
                    label: "Billing Street Address",
                    name: "billingStreetAddress",
                    type: "textarea",
                    readOnly: 1,
                    isRequired: 0,
                    validationDetail: "Value from client details sheet, field billingStreetAddress (column J) to be populated as static text (this will help the user to understand whether they have selected the correct accountName value in field 1)"
                },
                jd_workLocationStreetAddress: {
                    label: "Street Adress Where Work Completed",
                    name: "workLocationStreetAddress",
                    type: "text",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_workLocationSuburb: {
                    label: "Suburb Where Work Completed",
                    name: "workLocationSuburb",
                    type: "select",
                    values: ["", "Paraparaumu", "Raumati Beach", "Raumati South", "Otaihanga", "Waikanae", "Waikanae Beach"],
                    readOnly: 0,
                    isRequired: 0
                },
                jd_primaryJobType: {
                    label: "Primary Job Type",
                    name: "primaryJobType",
                    type: "select",
                    values: ["", "Maintenance", "Painting", "Fencing", "Paving", "Gardening", "Deck", "Installation", "Bathroom Reno", "Kitchen Reno", "Laundry Reno", "Sub-Contractor", "Rubbish Removal", "Furniture Removal", "Other Landscaping", "Other Carpentry", "Plaster Repairs"],
                    readOnly: 0,
                    isRequired: 1
                },
                jd_secondaryJobType: {
                    label: "Seconday Job Type",
                    name: "secondaryJobType",
                    type: "select",
                    values: ["", "Maintenance", "Painting", "Fencing", "Paving", "Gardening", "Deck", "Installation", "Bathroom Reno", "Kitchen Reno", "Laundry Reno", "Sub-Contractor", "Rubbish Removal", "Furniture Removal", "Other Landscaping", "Other Carpentry", "Plaster Repairs"],
                    readOnly: 0,
                    isRequired: 0
                },
                jd_indoorsOutdoors: {
                    label: "Indoors or Outdoors",
                    name: "indoorsOutdoors",
                    type: "select",
                    values: ["", "Indoors", "Outdoors"],
                    readOnly: 0,
                    isRequired: 1
                },
                jd_dateJobEnquiry: {
                    label: "Date of Job Enquiry",
                    name: "dateJobEnquiry",
                    type: "date",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_dateJobQuoted: {
                    label: "Date Job Quoted",
                    name: "dateJobQuoted",
                    type: "date",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_dateInvoiceSent: {
                    label: "Date Invoice Sent",
                    name: "dateInvoiceSent",
                    type: "date",
                    readOnly: 0,
                    isRequired: 1
                },
                jd_invoiceAmount: {
                    label: "Amount Invoiced (excl. GST)",
                    name: "invoiceAmount",
                    type: "number",
                    readOnly: 0,
                    isRequired: 1
                },
                jd_materialsCost: {
                    label: "Materials Cost",
                    name: "materialsCost",
                    type: "number",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_costSubcontractor: {
                    label: "Sub-Contractor Cost",
                    name: "costSubcontractor",
                    type: "number",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_costOther: {
                    label: "Other Cost (Excluding Staff Cost)",
                    name: "costOther",
                    type: "number",
                    readOnly: 0,
                    isRequired: 0
                },
                jd_daveHours: {
                    label: "Dave Hours",
                    name: "daveHours",
                    type: "number",
                    readOnly: 0,
                    isRequired: 0,
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_westyHours: {
                    label: "Westy Hours",
                    name: "westyHours",
                    type: "number",
                    readOnly: 0,
                    isRequired: 0,
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_peteHours: {
                    label: "Pete Hours",
                    name: "peteHours",
                    type: "number",
                    readOnly: 0,
                    isRequired: 0,
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_boofHours: {
                    label: "Boof Hours",
                    name: "boofHours",
                    type: "number",
                    readOnly: 0,
                    isRequired: 0,
                    validationDetail: "Must have > 0 hours across all staff"
                },
                jd_workSatisfaction: {
                    label: "Satisfaction With Work?",
                    name: "workSatisfaction",
                    type: "select",
                    values: [1, 2, 3, 4, 5],
                    readOnly: 0,
                    isRequired: 1
                }
            }
        }
    }
}


export default data
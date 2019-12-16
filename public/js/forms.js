import lib from './library.js';

const forms = {
    constructForm: function (formName) {

        const data = document.appData.formOptions;

        //  find form element
        let formEle = document.getElementById(formName + 'Form'),
            structureArr = data[formName].structure,
            fieldData = data[formName].fields;

        formEle.setAttribute('method', 'POST');
        formEle.setAttribute('action', '/' + document.appData.businessName + '/' + data[formName].restfulName);

        //  for each item in the structure array, create fieldset.form-group with legend of the sectionTitle
        for (let i = 0; i < structureArr.length; i++) {

            formEle.appendChild(constructFormSection(structureArr[i]));

        }

        // create buttons fieldset
        let buttonsFieldset = document.createElement('fieldset');
        buttonsFieldset.classList.add('border-0');
        buttonsFieldset.classList.add('d-flex');
        let row = document.createElement('div');
        addClasses(row, ['row', 'justify-content-end']);

        // append buttons to fieldset
        // row.appendChild(constructButtonCol('Clear', 'button', ['btn-outline-secondary']));
        row.appendChild(constructButtonCol('Submit', 'submit', ['btn-secondary', 'form-submit']));

        // append row to buttons fieldset
        buttonsFieldset.appendChild(row);

        // append button fieldset to form
        formEle.appendChild(buttonsFieldset);

        function addClasses(ele, classArr) {
            for (let q = 0; q < classArr.length; q++) {
                ele.classList.add(classArr[q]);
            }
            return ele
        }

        function constructButtonCol(btnText, btnType, btnClassArr) {

            let col = document.createElement('div'),
                btn = document.createElement('button'),
                classArr = ['btn', 'd-inline', 'btn-block'];

            addClasses(col, ['col-2', 'p-0', 'pl-3']);
            btnClassArr.forEach(classItem => classArr.push(classItem))
            addClasses(btn, classArr);
            btn.setAttribute('type', btnType);
            btn.appendChild(document.createTextNode(btnText));
            col.appendChild(btn);

            return col;

        }

        function constructFormSection(sectionDetail) {

            let fieldsetEl = document.createElement('fieldset');
            fieldsetEl.classList.add('form-group');

            let legendEl = document.createElement('legend')

            fieldsetEl.appendChild(legendEl);

            let legendText = document.createTextNode(sectionDetail.sectionTitle);
            legendEl.appendChild(legendText);

            for (let j = 0; j < sectionDetail.fields.length; j++) {
                fieldsetEl.appendChild(constructInputRow(sectionDetail.fields[j]))
            }

            function constructInputRow(fieldsArr) {

                // create container element
                let containerEl = document.createElement('div'),
                    innerEl;
                containerEl.classList.add('row');

                // loop through array of fields to include in row
                for (let k = 0; k < fieldsArr.length; k++) {

                    let fieldDetail = fieldData[fieldsArr[k]];
                    let uniqueName = formName + '-' + fieldDetail.fieldName;

                    // create column element
                    innerEl = document.createElement('div');
                    innerEl.classList.add('col-6');

                    // create label
                    let labelEl = document.createElement('label'),
                        labelText = fieldDetail.isRequired ? fieldDetail.label + ' *' : fieldDetail.label,
                        labelTextNode = document.createTextNode(labelText);
                    labelEl.appendChild(labelTextNode);
                    labelEl.setAttribute('for', uniqueName);
                    innerEl.appendChild(labelEl);

                    // create input and add relevant classes and attributes
                    let type = (fieldDetail.fieldType === 'select' || fieldDetail.fieldType === 'textarea') ? fieldDetail.fieldType : 'input',
                        inputEl = document.createElement(type);
                    if (fieldDetail.additionalClasses && fieldDetail.additionalClasses.length > 0) addClasses(inputEl, fieldDetail.additionalClasses)
                    inputEl.classList.add('form-control');
                    inputEl.setAttribute('id', uniqueName);
                    if (!fieldDetail.submitExclude) inputEl.setAttribute('name', fieldDetail.fieldName);
                    if (fieldDetail.pattern) inputEl.setAttribute('pattern', fieldDetail.pattern)
                    if (type === 'input') inputEl.setAttribute('type', fieldDetail.fieldType);
                    if (fieldDetail.fieldType === 'number') inputEl.setAttribute('step', '0.01');
                    if (fieldDetail.isRequired) inputEl.required = true;
                    if (fieldDetail.readOnly) inputEl.setAttribute('readonly', true);

                    if (fieldDetail.fieldType === 'datalist') inputEl.setAttribute('list', fieldDetail.fieldName + 'List');
                    if (fieldDetail.fieldType === 'select') addDatalistOptions(inputEl, fieldDetail.values);

                    innerEl.appendChild(inputEl);

                    if (fieldDetail.fieldType === 'datalist') innerEl.appendChild(constructDataList(fieldDetail));
                    if (fieldDetail.fieldType === 'hidden') innerEl.classList.add('d-none');

                    containerEl.appendChild(innerEl);

                }

                function constructDataList(fieldDetail) {

                    let dl = document.createElement('datalist');

                    dl.setAttribute('id', fieldDetail.fieldName + 'List')

                    return addDatalistOptions(dl, fieldDetail.values);

                }

                function addDatalistOptions(housingEl, values) {
                    let option, text;
                    for (let l = 0; l < values.length; l++) {
                        option = document.createElement('option');
                        option.setAttribute('value', values[l]);
                        text = document.createTextNode(values[l]);
                        option.appendChild(text);
                        housingEl.appendChild(option);
                    }
                    return housingEl
                }

                return containerEl;

            }

            return fieldsetEl;

        }

    },

    initAutocomplete: function () {

        function initAddy(fields) {

            let addyComplete = new AddyComplete(document.getElementById(fields.searchField));

            addyComplete.options.excludePostBox = false;
            addyComplete.fields = {
                address1: document.getElementById(fields.address1),
                suburb: document.getElementById(fields.suburb),
                city: document.getElementById(fields.city),
                postcode: document.getElementById(fields.postcode),
            }
        }

        initAddy({
            searchField: 'clientDetails-billingAddressStreet',
            address1: 'clientDetails-billingAddressStreet',
            suburb: 'clientDetails-billingAddressSuburb',
            city: 'clientDetails-billingAddressCity',
            postcode: 'clientDetails-billingAddressPostcode',
            latitude: 'clientDetails-billingAddressLatitude',
            longitude: 'clientDetails-billingAddressLongitude'
        });
        initAddy({
            searchField: 'jobDetails-workLocationStreetAddress',
            address1: 'jobDetails-workLocationStreetAddress',
            suburb: 'jobDetails-workLocationSuburb',
            city: 'jobDetails-workLocationCity',
            postcode: 'jobDetails-workLocationPostcode',
            latitude: 'jobDetails-workLocationLatitude',
            longitude: 'jobDetails-workLocationLongitude'
        });

    },

    retrieveClientAddress: function (accountName) {

        let clientObj = document.appData.clientDetail.find((val) => {
            return val.accountName === accountName
        });

        return axios.get('/' + document.appData.businessName + '/clients?requestType=address&clientId=' + (Number(clientObj.clientId) + 1));

    },

    setViewKeys: function () {

        doWork('client');
        doWork('job');

        async function doWork(dim) {

            // retrieve keys for dimension's db record
            let result;
            try {
                result = await axios.get('/' + document.appData.businessName + '/' + dim + 's?requestType=keys');
            } catch (err) {
                console.error("Error in setViewKeys doWork async step for " + dim + " dimension");
                console.error(err);
            }

            // define vars
            let $viewFieldset = $('#' + dim + 'ViewFormBody fieldset');
            let fieldLabels = result.data.fieldLabels;
            let fieldNames = result.data.fieldNames;

            // loop through keys and create element tree, then apply key to first el
            for (let i = 0; i < fieldLabels.length; i++) {

                // create row
                let row = createEl('div', ['row']);
                $viewFieldset[0].appendChild(row);

                // create column to hold field label
                let col = createEl('div', ['col-3', 'form-view-text-sm']);
                col.appendChild(document.createTextNode(lib.capitaliseWords(fieldLabels[i]) + ':'));
                row.appendChild(col);

                // create column to hold value
                let col2 = createEl('div', ['col-9', 'form-view-text-lg']);
                row.appendChild(col2);
                let input = createEl('input', ["form-control"]);
                input.setAttribute('type', 'text');
                input.setAttribute('name', fieldNames[i]);
                input.setAttribute('readonly', true);
                col2.appendChild(input)

            }

            function createEl(elType, classes) {
                let el = document.createElement(elType);
                for (let i = 0; i < classes.length; i++) {
                    el.classList.add(classes[i]);
                }
                return el;
            }

        }

    },

    setClientDetails: async function () {

        let clientDetails
        try {
            // retrieve client details from server
            clientDetails = await axios.get('/' + document.appData.businessName + '/clients?requestType=detailsArray');
        } catch (err) {
            console.error("Error retrieving client details in setClientDetails axios call");
            return console.error(err);
        }

        // set values in account name list
        let $accountNameDatalist = $('#accountNameList');
        $accountNameDatalist.empty();

        for (let i = 0; i < clientDetails.data.length; i++) {

            let option = document.createElement('option');
            option.setAttribute('value', clientDetails.data[i].accountName);
            option.appendChild(document.createTextNode(clientDetails.data[i].accountName));
            $accountNameDatalist[0].appendChild(option);

        }

        // set options in client select drop-down
        // find field and empty
        let $clientDetailsDatalist = $('#clientDetailsList');
        $clientDetailsDatalist.empty();

        // create datalist options 
        for (let i = 0; i < clientDetails.data.length; i++) {

            let concat = 'Account: ' +
                clientDetails.data[i].accountName +
                ', Billing Address: ' +
                clientDetails.data[i].billingAddressStreet +
                ', ' +
                clientDetails.data[i].billingAddressSuburb

            document.appData.clientDetail[i].concat = concat;

            let option = document.createElement('option');
            option.setAttribute('value', concat);
            option.setAttribute('data-key', clientDetails.data[i].clientId);
            $clientDetailsDatalist[0].appendChild(option);

        }

    },

    setJobOptions: async function () {

        let jobDetail
        // pull through job deets
        try {
            jobDetail = await axios.get('/' + document.appData.businessName + '/jobs?requestType=detailsArray')
        } catch (err) {
            console.error("Error in setJobOptions - failed to retrieve job details from Server");
            return console.error(err);
        }

        // set array as app variable
        document.appData.jobDetail = jobDetail.data;

        // find field and empty
        let $jobDetailDatalist = $('#jobDetailsList');
        $jobDetailDatalist.empty();

        // create datalist options from 
        for (let i = 0; i < jobDetail.data.length; i++) {

            let concat = 'Account: ' +
                jobDetail.data[i].accountName +
                ', Date Invoice Sent: ' +
                jobDetail.data[i].dateInvoiceSent +
                ', Amount Invoiced: ' +
                jobDetail.data[i].amountInvoiced

            document.appData.jobDetail[i].concat = concat;

            let option = document.createElement('option');
            option.setAttribute('value', concat);
            option.setAttribute('data-key', jobDetail.data[i].jobId);
            $jobDetailDatalist[0].appendChild(option);

        }

    },

    submitFormFlow: function (form, formName, statusDiv) {

        lib.initSpinner();

        // pull out and transform form data
        let formData = form.serializeArray().reduce(function (obj, val) {
            obj[val.name] = val.value
            return obj
        }, {});

        // fire off axios request to relevant post endpoint to create record in db
        axios.post('/' + document.appData.businessName + '/' + form[0].dataset.name + 's', formData)
            .then(function (result) {

                // if result other than 200 received, flag error
                if (!result.status === 200) {

                    new Error('Form submit POST request failed with status code ' + result.status + ' and status text: ' + result.statusText);

                } else {

                    let message = formName + ' record successfully added to database for ' + formData.accountName;

                    // trigger success alert
                    lib.revealStatusMessage(form.attr('data-name'), 'success', 'Success', message);

                    // clear form
                    form[0].reset();
                    if (formName === 'Job') form.find('#jobDetails-billingAddress').val("");

                }

            })
            .catch(function (error) {

                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error(error.response.data);
                    console.error(error.response.status);
                    console.error(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.error(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error', error.message);
                }
                console.error(error.config);

                // trigger error alert with message
                lib.revealStatusMessage(formName, 'danger', 'Error', 'Record could not be added to the database.');

            })
            .then(lib.endSpinner);

    },

    validateClientForm: function () {

        // check if account name entered matches one from list
        let $clientDetailsForm = $('#clientDetailsForm'),
            optionsNodeList = $('#jobDetailsForm').find('#accountNameList').children(),
            accountName = $clientDetailsForm.find('#clientDetails-accountName').val(),
            accountNameVals = [];

        for (let i = 0; i < optionsNodeList.length; i++) {
            accountNameVals.push($(optionsNodeList[i]).val());
        }

        if (accountNameVals.includes(accountName)) return "Account " + accountName + " already exists in database. Please submit jobs under existing client record."

        // if all validation passed, return true
        return true;

    },

    validateJobForm: function () {

        // check if account name entered matches one from list
        let $jobDetailsForm = $('#jobDetailsForm'),
            accountName = $jobDetailsForm.find('#jobDetails-accountName').val(),
            accountNameVals = [];

        for (let i = 0; i < document.appData.clientDetail.length; i++) {
            accountNameVals.push(document.appData.clientDetail[i].accountName);
        }
        if (!accountNameVals.includes(accountName)) return "Please ensure Account Name is a valid option from the drop-down list. It must have already been created using the Client Details form."

        // check if dates entered 
        let $dateFields = $jobDetailsForm.find('input[type="date"]'),
            cd = new Date(),
            tenYearsBack = new Date(cd.getFullYear() - 10, cd.getMonth(), cd.getDate());

        for (let i = 0; i < $dateFields.length; i++) {
            let dateVal = new Date($($dateFields[i]).val());

            if (dateVal !== 'Invalid Date' && (dateVal > cd || dateVal < tenYearsBack)) return "Please ensure all entered dates are in the past within the last 10 years."
        }

        // check to ensure at least 1 hour of work has been entered
        let sum = 0;
        $jobDetailsForm.find('.staff-hours').each((i, field) => sum += $(field).val());

        if (sum == 0) return "Please ensure the total of hours entered for this job is greater than zero."

        // if all validation passed, return true
        return true;

    },

}

export default forms
import data from './form-options.js';

const forms = {
    constructForm: function (formName) {
        //  find form element
        let formEle = document.getElementById(formName + 'Form'),
            structureArr = data.formData[formName].structure,
            fieldData = data.formData[formName].fields;

        formEle.setAttribute('method', 'POST');
        formEle.setAttribute('action', '/' + document.appData.businessName + '/' + data.formData[formName].restfulName);

        //  for each item in the structure array, create fieldset.form-group with legend of the sectionTitle
        for (let i = 0; i < structureArr.length; i++) {
            formEle.appendChild(constructFormSection(structureArr[i]));
        }

        // create buttons fieldset
        let buttonsFieldset = document.createElement('fieldset');
        buttonsFieldset.classList.add('border-0');
        buttonsFieldset.classList.add('d-flex');
        let row = document.createElement('div');
        addClasses(row, ['row', 'justify-content-end'])

        // append buttons to fieldset
        row.appendChild(constructButtonCol('Clear', 'button', ['btn-outline-secondary']));
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
                    if (fieldDetail.isRequired) inputEl.required = true;
                    if (fieldDetail.readOnly) inputEl.setAttribute('readonly', true);

                    if (fieldDetail.fieldType === 'datalist') inputEl.setAttribute('list', fieldDetail.fieldName + 'List');
                    if (fieldDetail.fieldType === 'select') addOptions(inputEl, fieldDetail.values);

                    innerEl.appendChild(inputEl);

                    if (fieldDetail.fieldType === 'datalist') innerEl.appendChild(constructDataList(fieldDetail));

                    containerEl.appendChild(innerEl);

                }

                function constructDataList(fieldDetail) {

                    let dl = document.createElement('datalist');

                    dl.setAttribute('id', fieldDetail.fieldName + 'List')

                    return addOptions(dl, fieldDetail.values);

                }

                function addOptions(housingEl, values) {
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

    retrieveClientAddress: function (accountName) {
        
        let clientObj = document.clients.find((val) => {
            return val.accountName === accountName
        });

        return axios.get('/clients?requestType=clientAddress&clientId=' + (Number(clientObj.clientId) + 1));

    },

    setAccountNameOptions: function () {

        // pull through clients deets
        axios.get('/' + document.appData.businessName + '/clients?requestType=clients')
            .then((response) => {

                document.clients = response.data;

                let $accountNameDatalist = $('#accountNameList');

                $accountNameDatalist.empty();

                for(let i = 0; i < document.clients.length; i++) {

                    let option = document.createElement('option');
                    option.setAttribute('value', document.clients[i].accountName);
                    option.appendChild(document.createTextNode(document.clients[i].accountName));
                    $accountNameDatalist[0].appendChild(option);

                }

            })
            .catch(console.log);

    },

    validateClientForm: function () {

    },

    validateJobForm: function () {

        // check if account name entered matches one from list
        let optionsNodeList = $jobDetailsForm.find('#accountNameList').children(),
            accountName = $jobDetailsForm.find('#jobDetails-accountName').val(),
            accountNameVals = [];

        for (let i = 0; i < optionsNodeList.length; i++) {
            accountNameVals.push($(optionsNodeList[i]).val());
        }

        if (!accountNameVals.includes(accountName)) return "Please ensure Account Name is a valid option from the drop-down list. It must have already been created using the Client Details form."

        // check if dates entered 
        let $dateFields = $jobDetailsForm.find('input[type="date"]'),
            cd = new Date(),
            tenYearsBack = new Date(cd.getFullYear() - 10, cd.getMonth(), cd.getDate());

        for (let i = 0; i < $dateFields.length; i++) {
            let dateVal = new Date($($dateFields[i]).val());
            console.log(dateVal);
            if (dateVal !== 'Invalid Date' && (dateVal > cd || dateVal < tenYearsBack)) return "Please ensure all entered dates are in the past within the last 10 years."
        }

        // check to ensure at least 1 hour of work has been entered
        let sum = 0;
        $jobDetailsForm.find('.staff-hours').each((i, field) => sum += $(field).val());
        console.log(sum);
        if (sum == 0) return "Please ensure the total of hours entered for this job is greater than zero."

        // if all validation passed, return true
        return true;

    }
}

export default forms
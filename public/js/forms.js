import data from './form-options.js';

export default function constructForm(formName) {
    //  find form element
    let formEle = document.getElementById(formName + 'Form'),
        structureArr = data.formData[formName].structure,
        fieldData = data.formData[formName].fields;

    //  for each item in the structure array, create fieldset.form-group with legend of the sectionTitle
    for (let i = 0; i < structureArr.length; i++) {
        formEle.appendChild(constructFormSection(structureArr[i]));
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

                let fieldDetail = fieldData[fieldsArr[k]],
                    uniqueName = formName + '-' + fieldDetail.fieldName;

                // create column element
                innerEl = document.createElement('div');
                innerEl.classList.add('col-6');

                // create label
                let labelEl     = document.createElement('label'),
                    labelText   = document.createTextNode(fieldDetail.label);
                labelEl.appendChild(labelText);
                labelEl.setAttribute('for', uniqueName);
                innerEl.appendChild(labelEl);

                // create input
                let type = (fieldDetail.fieldType === 'select' || fieldDetail.fieldType === 'textarea') ? fieldDetail.fieldType : 'input',
                    inputEl = document.createElement(type);
                inputEl.classList.add('form-control');
                inputEl.setAttribute('id', uniqueName);
                inputEl.setAttribute('name', fieldDetail.fieldName);
                if (type === 'input') inputEl.setAttribute('type', fieldDetail.fieldType);
                if (fieldDetail.isRequired) inputEl.required = true;
                if (fieldDetail.readOnly) inputEl.setAttribute('readonly', true);

                if (fieldDetail.fieldType === 'datalist') inputEl.setAttribute('list', fieldDetail.fieldName + 'List');

                innerEl.appendChild(inputEl);

                if (fieldDetail.fieldType === 'datalist') innerEl.appendChild(constructDataList(fieldDetail));

                containerEl.appendChild(innerEl);

            }

            function constructDataList(fieldDetail) {
                console.log(fieldDetail);
                let dl = document.createElement('datalist'),
                    option, text;
                dl.setAttribute('id', fieldDetail.fieldName + 'List')
                for (let l = 0; l < fieldDetail.values.length; l++) {
                    option = document.createElement('option');
                    text = document.createTextNode(fieldDetail.values[l]);
                    option.appendChild(text);
                    dl.appendChild(option);
                }
                return dl;
            }

            return containerEl;

        }

        return fieldsetEl;

    }

}
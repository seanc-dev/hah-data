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

    // create buttons fieldset
    let buttonsFieldset = document.createElement('fieldset');
    buttonsFieldset.classList.add('border-0');
    buttonsFieldset.classList.add('d-flex');
    let row = document.createElement('div');
    addClasses(row, ['row', 'justify-content-end'])

    // append buttons to fieldset
    row.appendChild(constructButtonCol('Clear', 'button', 'btn-outline-secondary'));
    row.appendChild(constructButtonCol('Submit', 'submit', 'btn-secondary'));

    // append row to buttons fieldset
    buttonsFieldset.appendChild(row);

    // append button fieldset to form
    formEle.appendChild(buttonsFieldset);

    function addClasses(ele, classArr){
        for(let q = 0; q < classArr.length; q++){
            ele.classList.add(classArr[q]);
        }
        return ele
    }

    function constructButtonCol(btnText, btnType, btnClass){

        let col = document.createElement('div');
        addClasses(col, ['col-2', 'p-0', 'pl-3']);
        let btn = document.createElement('button');
        addClasses(btn, ['btn', btnClass, 'd-inline', 'btn-block']);
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

                let fieldDetail = fieldData[fieldsArr[k]],
                    uniqueName = formName + '-' + fieldDetail.fieldName;

                // create column element
                innerEl = document.createElement('div');
                innerEl.classList.add('col-6');

                // create label
                let labelEl         = document.createElement('label'),
                    labelText       = fieldDetail.isRequired ? fieldDetail.label + ' *' : fieldDetail.label,
                    labelTextNode   = document.createTextNode(labelText);
                labelEl.appendChild(labelTextNode);
                labelEl.setAttribute('for', uniqueName);
                innerEl.appendChild(labelEl);

                // create input and add relevant classes and attributes
                let type = (fieldDetail.fieldType === 'select' || fieldDetail.fieldType === 'textarea') ? fieldDetail.fieldType : 'input',
                    inputEl = document.createElement(type);
                if(fieldDetail.additionalClasses && fieldDetail.additionalClasses.length > 0) addClasses(inputEl, fieldDetail.additionalClasses)
                inputEl.classList.add('form-control');
                inputEl.setAttribute('id', uniqueName);
                inputEl.setAttribute('name', fieldDetail.fieldName);
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

            function addOptions(housingEl, values){
                let option, text;
                console.log(values)
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

}
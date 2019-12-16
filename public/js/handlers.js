import forms from './forms.js';
import lib from './library.js';

const handlers = {

    handleAccountNameBlur: function () {

        let accountNameField = $('#jobDetails-accountName');

        accountNameField.blur(function (e) {

            forms.retrieveClientAddress(accountNameField.val())
                .then((result) => {

                    if (!result.data[0] || result.data[0].length < 1) return $('#jobDetails-billingAddress').html("No address in database." + '\n' + "Please update client record.")

                    $('#jobDetails-billingAddress').html(result.data[0] + '\n' + result.data[1]);
                    $('#jobDetails-workLocationStreetAddress').val(result.data[0]);
                    $('#jobDetails-workLocationSuburb').val(result.data[1]);

                })
                .catch(console.error);

            $('#jobDetails-clientId').val(lib.getClientObj(accountNameField.val()).clientId);

        })

    },

    handleAccountTypeInput: function () {

        $('.account-name').on('input', () => {
            let value = lib.getAccountNameValue(),
                reg = /\b(\w*undefined\w*)\b/g;
            if (value === undefined || value.search(reg) > -1) value = '';
            $('#clientDetails-accountName').val(value);
        });

    },

    handleInputFocus: function () {
        let inputs = $('.form-control');
        inputs.focus(function () {
            $(this).closest('div').find('label').addClass('active');
        });
        inputs.blur(function () {
            $(this).closest('div').find('label').removeClass('active');
        });
    },

    handleFormSubmit: function () {

        $('.form-submit').click(function (e) {

            e.preventDefault();

            let $form = $(this).closest('form');
            let formType = $form[0].dataset.name.charAt(0).toUpperCase() + $form[0].dataset.name.slice(1);
            let $statusDiv = $form.closest('.form-content').find('.status-message');

            lib.setCreatedDate();

            let validation

            if (formType === 'Client') validation = forms.validateClientForm();
            if (formType === 'Job') validation = forms.validateJobForm();

            // check default validity. If fails, report validity
            if ($form[0].checkValidity()) {

                // check custom validation. if successful, submit and append client details to array. If unsuccessful, report in error message
                if (validation === true) {

                    forms.submitFormFlow($form, formType, $statusDiv);

                    if (formType === 'Client') {

                        // find values to add to clientDetail array
                        let accountNameVal = $form.find('input[name="accountName"]').val(),
                            clientIdVal = document.appData.clientDetail.slice(-1)[0].clientId + 1;

                        // set clientId in form
                        $form.find('#clientDetails-clientId').val(clientIdVal);

                        // append new item to array
                        document.appData.clientDetail.push({
                            clientId: clientIdVal,
                            accountName: accountNameVal
                        });

                        // append new option node to datalist for job details account name field
                        let option = document.createElement('option');
                        option.setAttribute('value', accountNameVal);
                        document.getElementById('accountNameList').appendChild(option);

                    }

                } else {

                    // else, fail validation and present custom error message
                    lib.revealStatusMessage(formType.toLowerCase(), 'danger', 'Error', validation)

                }

            } else {

                $form[0].reportValidity();

            }

        });

    },

    handleFormTabClick: function () {

        let formTabArr = $('.tab-card')
        formTabArr.on('click', function () {

            // set clicked tab active and all others inactive
            formTabArr.each(function (i, element) {
                element.classList.remove("active-tab");
            });
            this.classList.add("active-tab");

            // toggle form content
            $('.form-content').addClass('d-none');

            let clickedTabName = $(this).attr('data-tab-id');
            $('#' + clickedTabName).removeClass('d-none');

        });

    },

    handlerFormTypeSelect: function () {

        $('.form-type-select').change(function (e) {

            let formType = this.value;
            let $formBody = $(this).closest('.card').find('.form-body');
            let $form = $formBody.find('form');
            let $recordView = $formBody.find('.form-view-body');
            let $formInputs = $form.find('input select');
            let dim = $form.attr('data-name');
            toggleRecordSelectVisibility = toggleRecordSelectVisibility.bind(this);

            if (formType === "New") {

                // toggle record select
                toggleRecordSelectVisibility(false);

                // Ensure form is visible and data view is not
                toggleFormVisibility(true);

                // Clear all other fields, set as non-read-only
                $form[0].reset()
                toggleReadOnly(false);

                // Remove info popup
                $('#' + dim + 'DetailsForm').closest('.form-content').find('.status-message').alert('close');

            } else if (formType === "View") {

                // Ensure record select is visible
                toggleRecordSelectVisibility(true);

                // Ensure form not visible and data view is
                toggleFormVisibility(false);

                // Pop up info alert to populate record select field which disappears upon selection
                revealPopUp();

                // toggle delete button
                toggleDeleteButton(false);

            } else if (formType === "Edit") {

                // Ensure record select is visible
                toggleRecordSelectVisibility(true);

                // Ensure form is visible and data view is not
                toggleFormVisibility(true);

                // Pop up info alert to populate record select field which disappears upon selection
                revealPopUp();

                // Clear all other fields, set as non-read-only
                $form[0].reset()
                toggleReadOnly(false);

            } else if (formType === "Delete") {

                // Ensure record select is visible
                toggleRecordSelectVisibility(true);

                // Ensure form not visible and data view is
                toggleFormVisibility(false);

                // Pop up info alert to populate record select field which disappears upon selection
                revealPopUp();

                // reveal delete button
                toggleDeleteButton(true);

            }

            function toggleRecordSelectVisibility(bool) {

                let $formRecordSelect = $(this).closest('.row').find('.form-record-select-div');

                console.log($formRecordSelect);

                if (bool) {
                    $formRecordSelect.removeClass('d-none');
                } else {
                    $formRecordSelect.addClass('d-none');
                }

            }

            function toggleFormVisibility(bool) {

                if (bool) {
                    $form.removeClass('d-none');
                    $recordView.addClass('d-none')
                } else {
                    $form.addClass('d-none');
                    $recordView.removeClass('d-none')
                }

            }

            function toggleReadOnly(bool) {

                $formInputs.attr('readonly', bool);
                let readOnlyFieldName = dim === 'client' ? 'clientDetails-accountName' : 'jobDetails-billingAddress';
                $formInputs.find('#' + readOnlyFieldName).attr('readonly', true);

            }

            function revealPopUp() {

                lib.revealStatusMessage(dim, 'info', false, 'Please select a ' + dim + ' to ' + formType.toLowerCase());

            }

            function toggleDeleteButton(bool) {

                let el = $formBody.find('.delete-btn').closest('fieldset');
                if (bool) {
                    el.removeClass('d-none');
                    el.addClass('d-flex')
                } else {
                    el.addClass('d-none');
                    el.removeClass('d-flex')
                }

            }

        })

    },

    handleRecordSelectChange: async function () {

        $('.form-record-select-div').find('input').change(function (e) {

            console.log('record select change handler entered')

            let $contentEl = $(this).closest('.form-content')
            let ft = $contentEl.find('form').attr('data-name');
            let $viewBody = $contentEl.find('.form-view-body');
            let str = $(this).val();
            let id = document.appData[ft + 'Detail'].find(obj => str === obj.concat)[ft + 'Id'];

            axios.get('/' + document.appData.businessName + '/' + ft + 's/' + id)
                .then((result) => {

                    let keys = Object.keys(result.data);
                    console.log(result.data);
                    $viewBody.find('input');

                    // loop through returned properties and apply as values to relevant cells
                    for (let i = 0; i < keys.length; i++) {

                        $viewBody.find('input[name="' + keys[i] + '"]').val(result.data[keys[i]]);

                    }

                })
                .catch((err) => {
                    console.error(err);
                    lib.revealStatusMessage(ft, 'danger', 'Error', 'Failed to retrieve client details from Database. Please refresh page.')
                })

        })

    },

    handleDeleteBtnClick: function () {

        $('.delete-btn').click(function (e) {

            // initiate loading spinner
            lib.initSpinner();

            let $form = $(this).closest('.form-content').find('form');
            let formType = $form.attr('data-name');
            let field = 'selected' + lib.capitaliseWords(formType);
            let accountName = $form.find('input[name="accountName"]').val();
            let id

            if (document.appData[field]) id = document.appData[field];

            axios('delete', '/' + document.appData.businessName + '/' + formType + 's/' + id)
                .then((result) => {
                    // implement success message and clear fields
                    lib.revealStatusMessage(formType, 'success', 'Success', 'Deleted ' + formType + ' record for ' + accountName);
                    $(this).closest('.form-view-body').find('input').empty();
                }).bind(this)
                .catch((err) => {
                    // log error and implement failure message
                    console.error(err);
                    lib.revealStatusMessage(formType, 'error', 'Error', 'Failed to delete record');
                })
                .then(lib.endSpinner);

        });

    },

    handleAlertHide: function () {

        $('.alert').on('close.bs.alert', function (e) {

            e.preventDefault();

            this.classList.add('d-none');

        })

    }

}

export default handlers;
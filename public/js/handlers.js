import forms from './forms.js';
import lib from './library.js';

const $jobDetailsForm = $('form#jobDetailsForm'),
    $clientDetailsForm = $('form#clientDetailsForm'),
    $jobDetailsStatusDiv = $jobDetailsForm.closest('.form-content').find('.status-message'),
    $clientDetailsStatusDiv = $clientDetailsForm.closest('.form-content').find('.status-message');

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
                        let accountNameVal  = $form.find('input[name="accountName"]').val(),
                            clientIdVal     = document.appData.clientDetail.slice(-1)[0].clientId + 1;

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
                    $statusDiv.removeClass('d-none');
                    $statusDiv.removeClass('alert-success');
                    $statusDiv.addClass('alert-danger');
                    $statusDiv.find('span')[0].innerHTML = '<strong>Error:</strong> ' + validation
                    $statusDiv.focus();

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

    handleAlertHide: function () {

        $('.alert').on('close.bs.alert', function(e){

            e.preventDefault();

            this.classList.add('d-none');

        })

    }

}

export default handlers;
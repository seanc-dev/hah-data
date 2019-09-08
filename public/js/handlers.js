import forms from './forms.js';
import lib from './library.js';

const $jobDetailsForm = $('form#jobDetailsForm'),
    $clientDetailsForm = $('form#clientDetailsForm'),
    $jobDetailsErrorRow = $jobDetailsForm.closest('.form-content').find('.error-message-row'),
    $clientDetailsErrorRow = $clientDetailsForm.closest('.form-content').find('.error-message-row');

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

    handleFormValidationOnClick: function () {

        validateForm($clientDetailsForm, $clientDetailsErrorRow, 'client');
        validateForm($jobDetailsForm, $jobDetailsErrorRow, 'job');

        function validateForm($form, $errorRow, formType) {

            $form.find('.form-submit').on('click', function (e) {

                // e.preventDefault();

                let validation

                if (formType === 'client') validation = forms.validateClientForm();
                if (formType === 'job') validation = forms.validateJobForm();

                // if validation passes (is 'true' boolean), submit form
                if (validation === true) {
                    let submitBtn = $form.find('.form-submit');
                    $errorRow.find('span').val("");
                    $errorRow.addClass('d-none');
                    if ($form[0].checkValidity()) {
                        lib.setCreatedDate();
                        if (formType === 'client') {

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

                        }
                    }
                } else {
                    // else, fail validation and present custom error message
                    e.preventDefault();
                    $errorRow.removeClass('d-none');
                    let errorSpan = $errorRow.find('.error-message');
                    errorSpan[0].innerText = 'Error: ' + validation
                }

            });

        }

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

    handleFormClear: function () {

        $('.btn-outline-secondary').click(function (e) {
            $(e.target).closest('form')[0].reset();
        });

    },

    handleFormSubmit: function () {

        $('.form-submit').click(function (e) {

            lib.setCreatedDate();

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

    }

}

export default handlers;
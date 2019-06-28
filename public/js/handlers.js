import forms    from './forms.js';
import lib      from './library.js';

const   $jobDetailsForm     = $('form#jobDetailsForm'),
        $jobDetailsErrorRow = $jobDetailsForm.closest('.form-content').find('.error-message-row');

const handlers = {

    handleAccountNameBlur: function () {

        let accountNameField = $('#jobDetails-accountName');

        accountNameField.blur(function(e){

            forms.retrieveClientAddress(accountNameField.val())
                .then((result) => {
                    $('#jobDetails-billingAddress').html(result.data[0] + '\n' + result.data[1]);
                })
                .catch((err) => {
                    console.error(err);
                });

                $('#jobDetails-clientId').val(lib.getClientObj(accountNameField.val()).clientId);

        })

    },

    handleAccountTypeInput: function () {

        $('.account-name').on('input', () => {
            let value = lib.getAccountNameValue(),
                reg     = /\b(\w*undefined\w*)\b/g;
            if(value === undefined || value.search(reg) > -1) value = '';
            $('#clientDetails-accountName').val(value);
        });

    },

    handleJobFormValidationOnClick: function () {
        $jobDetailsForm.find('.form-submit').on('click', function(e){

            e.preventDefault();

            // call validation function
            let validation = forms.validateJobForm();

            // if validation passes (is 'true' boolean), submit form
            if(validation === true) {
                let submitBtn = $jobDetailsForm.find('.form-submit');
                $jobDetailsErrorRow.find('span').val("");
                $jobDetailsErrorRow.addClass('d-none');
                if($jobDetailsForm[0].checkValidity()){
                    submitBtn.off('click');
                    lib.setCreatedDate();
                    submitBtn.click();
                } else {
                    submitBtn.off('click');
                    $jobDetailsForm.find('.form-submit').click();
                    this.handleJobFormValidationOnClick();
                };
            } else {
                // else, fail validation and present custom error message
                $jobDetailsErrorRow.removeClass('d-none');
                let errorSpan = $jobDetailsErrorRow.find('span');
                errorSpan[0].innerText = validation
            }

        });
    },

    handleInputFocus: function(){
        let inputs = $('.form-control');
        inputs.focus(function(){
            $(this).closest('div').find('label').addClass('active');
        });
        inputs.blur(function(){
            $(this).closest('div').find('label').removeClass('active');
        });
    },

    handleFormClear: function(){

        $('.btn-outline-secondary').click(function(e){
            $(e.target).closest('form')[0].reset();
        });
        
    },

    handleFormSubmit: function () {

        $('.form-submit').click(function(e){

            lib.setCreatedDate();

        });

    },

    handleFormTabClick: function() {

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
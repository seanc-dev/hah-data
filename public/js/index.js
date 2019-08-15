import forms    from './forms.js';
import handlers from './handlers.js';
import lib      from './library.js';

$(document).ready(function () {

    function init() {

        // remove body d-none once loaded static content (ensures loader is uninterrupted)
        document.querySelector('body').classList.remove('d-none');

        document.appData = {
            businessName: document.getElementById("businessName").innerText
        }

        // check if appData stored in local storage. If so, use it to generate forms. If not, generate new data
        let appData = JSON.parse(localStorage.getItem('appData'));

        if(!appData || appData.businessName !== document.appData.businessName) {

            lib.initialiseAppData()
                .then(function(result){

                    console.log(result); 

                    // set app data
                    document.appData.formOptions = result.data.formOptions;
                    document.appData.clientDetail = result.data.clientDetail;

                    localStorage.setItem('appData', JSON.stringify(document.appData));

                    // build forms
                    buildForms();

                    // kill loader
                    let event = new CustomEvent('appready')
                    document.dispatchEvent(event);
                    console.log('App ready!');

                })
                .catch((err) => {
                    console.error('Error in lib.initialiseAppData in index.init');
                    console.error(err)
                });

        } else {

            appData = JSON.parse(localStorage.getItem('appData'));
            document.appData.formOptions = appData.formOptions;
            document.appData.clientDetail = appData.clientDetail;
            lib.initialiseAppData()
                .then(function(result){

                // set app data
                document.appData.formOptions = result.data.formOptions;
                document.appData.clientDetail = result.data.clientDetail;

                localStorage.setItem('appData', JSON.stringify(document.appData));

                forms.setAccountNameOptions();

                })
                .catch((err) => {
                    console.error("Error in index.js else lib.initialiseAppData");
                    console.error(err);
                });

            // build forms..
            buildForms();

            // kill loader
            let event = new CustomEvent('appready')
            document.dispatchEvent(event);
            console.log('App ready!');

        }

        function buildForms(){

            let $clientDetailsForm  = $('form#clientDetailsForm');

            forms.constructForm('clientDetails');
            forms.constructForm('jobDetails');
            forms.setAccountNameOptions();
            forms.initAutocomplete();

            // event handlers
            handlers.handleFormTabClick();
            handlers.handleInputFocus();
            handlers.handleFormClear();
            handlers.handleAccountNameBlur();
            handlers.handleJobFormValidationOnClick();
            handlers.handleFormSubmit();
            handlers.handleAccountTypeInput();

        }

    }

    init();

});
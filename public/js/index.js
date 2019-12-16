import forms from './forms.js';
import handlers from './handlers.js';
import lib from './library.js';

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
            .then(function (result) {

                // set app data
                document.appData.formOptions = result.data.formOptions;
                document.appData.clientDetail = result.data.clientDetail;
                console.log(result.data.clientDetail);

                localStorage.setItem('appData', JSON.stringify(document.appData));

                // build forms
                buildForms();

                // kill loader
                let event = new CustomEvent('appready')
                document.dispatchEvent(event);
                console.log('App ready!');

            })
            .catch((err) => {
                alert("There was an error loading the forms. Please refresh the page.")
                console.error('Error in lib.initialiseAppData in index.init');
                console.error(err)
            });

        } else {

            appData = JSON.parse(localStorage.getItem('appData'));
            document.appData.formOptions = appData.formOptions;
            document.appData.clientDetail = appData.clientDetail;

            setTimeout(function(){

                lib.initialiseAppData()
                .then(function(result){

                // set app data
                document.appData.formOptions = result.data.formOptions;
                document.appData.clientDetail = result.data.clientDetail;

                localStorage.setItem('appData', JSON.stringify(document.appData));

                forms.setClientDetails();
                forms.setJobOptions();

                })
                .catch((err) => {
                    alert("There was an error loading the forms. Please refresh the page.")
                    console.error("Error in index.js else lib.initialiseAppData");
                    console.error(err);
                });

            // build forms..
            buildForms();

            // kill loader
            let event = new CustomEvent('appready')
            document.dispatchEvent(event);
            console.log('App ready!');

            }, 2000);
            
        }

        function buildForms() {

            // form construction
            forms.constructForm('clientDetails');
            forms.constructForm('jobDetails');
            forms.setClientDetails();
            forms.setJobOptions();
            forms.setViewKeys();
            forms.initAutocomplete();

            // event handlers
            handlers.handleFormTabClick();
            handlers.handlerFormTypeSelect();
            handlers.handleRecordSelectChange();
            handlers.handleInputFocus();
            handlers.handleAccountNameBlur();
            handlers.handleFormSubmit();
            handlers.handleAccountTypeInput();
            handlers.handleAlertHide();

        //     function applyTestData(){

        //         let data = { 
        //             accountType: 'Business',
        //             accountName: 'Test Test Test Ltd.',
        //             businessName: 'Test Test Test Ltd.',
        //             mainContactFirstName: 'Coley',
        //             mainContactLastName: 'Coley',
        //             mainContactLandline: '',
        //             mainContactMobile: '+64273493710',
        //             mainContactEmail: 'seanco.dev@gmail.com',
        //             billingAddressStreet: '11 Island View Terrace',
        //             billingAddressSuburb: 'Cockle Bay',
        //             billingAddressCity: 'Auckland',
        //             billingAddressPostcode: '2014',
        //             territory: 'South Wellington',
        //             customerDemographic: 'Baby Boomer (50-65 ish)',
        //             estimatedCustomerIncome: 'Pension',
        //             acquisitionChannel: 'Word of Mouth',
        //         }
    
        //         for (let key in data) {
    
        //             let el = document.getElementById('clientDetails-' + key);
                    
        //             el.value = data[key]
                    
        //         }
    
        //     }
    
        //     applyTestData();

        }

    }

    init();

});
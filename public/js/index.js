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

        let appData = JSON.parse(localStorage.getItem('appData'));

        if(!appData) {

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

            // event handlers
            handlers.handleFormTabClick();
            handlers.handleInputFocus();
            handlers.handleFormClear();
            handlers.handleAccountNameBlur();
            handlers.handleJobFormValidationOnClick();
            handlers.handleFormSubmit();
            handlers.handleAccountTypeInput();

            // add dummy data
            let dummyData = {
                accountType: 'Business',
                accountName: 'B',
                businessName: 'B',
                createdDateTimeNZT: '15/06/2019, 14:35:07',
                mainContactFirstName: 'F',
                mainContactLastName: 's',
                mainContactLandline: '',
                mainContactMobile: '',
                mainContactEmail: '',
                billingAddressStreet: 's',
                billingAddressSuburb: 'Paraparaumu',
                territory: 'Raumati',
                customerDemographic: 'Active Retiree',
                estimatedCustomerIncome: '$50,001 - $70,000',
                acquisitionChannel: 'Word of Mouth'
            }

            for (let key in dummyData) {
                let el
                if(key === 'accountType') {
                    el = $('#clientDetails-accountType');
                } else {
                    let form = $('#clientDetailsForm');
                    el = form.find('[name="' + key + '"]')
                };
                el.val(dummyData[key]);
            }

            dummyData = { accountName: 'Bloggs, Jimmy',
                workLocationStreetAddress: '11 Island View Terrace',
                workLocationSuburb: 'Waikanae',
                primaryJobType: 'Maintenance',
                secondaryJobType: 'Fencing',
                indoorsOutdoors: 'Outdoors',
                createdDateTimeNZT: '15/06/2019, 14:35:07',
                dateJobEnquiry: '2019-05-08',
                dateJobQuoted: '2019-05-10',
                dateWorkCommenced: '2019-06-01',
                dateInvoiceSent: '2019-06-10',
                amountInvoiced: '2000',
                costMaterials: '400',
                costSubcontractor: '100',
                costTipFees: '',
                costOther: '',
                hoursWorkedDave: '2',
                hoursWorkedWesty: '3',
                hoursWorkedPete: '5',
                hoursWorkedBoof: '',
                workSatisfaction: '5',
                clientId: '20'
            }

            for (let key in dummyData) {
                let form = $('#jobDetailsForm');
                let el = form.find('[name="' + key + '"]');
                el.val(dummyData[key]);
            }

        }

    }

    init();

});
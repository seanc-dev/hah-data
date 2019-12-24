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

        lib.initialiseAppData()
            .then(result => {

                // build forms
                buildForms();

                // kill loader
                let event = new CustomEvent('appready')
                document.dispatchEvent(event);
                console.log('App ready!');

            })
            .catch(err => {
                alert("There was an error loading the forms. Please refresh the page.")
                console.error('Error in lib.initialiseAppData in index.init');
                console.error(err)
            });

        function buildForms() {

            // form construction
            forms.constructForm('clientDetails');
            forms.constructForm('jobDetails');
            forms.setClientDetails();
            forms.setJobDetails();
            forms.setViewKeys();
            forms.initAutocomplete();

            // event handlers
            handlers.handleFormTabClick();
            handlers.handlerFormTypeSelect();
            handlers.handleRecordSelectChange();
            handlers.handleInputFocus();
            handlers.handleAccountNameBlur();
            handlers.handleFormSubmit();
            handlers.handleDeleteBtnClick();
            handlers.handleDeleteBtnConfirm();
            handlers.handleAccountTypeInput();
            handlers.handleAlertHide();

            let clientData = { 
                accountType: 'Business',
                accountName: 'Test Test Test Ltd.',
                businessName: 'Test Test Test Ltd.',
                mainContactFirstName: 'Coley',
                mainContactLastName: 'Coley',
                mainContactLandline: '',
                mainContactMobile: '+64273493710',
                mainContactEmail: 'seanco.dev@gmail.com',
                billingAddressStreet: '11 Island View Terrace',
                billingAddressSuburb: 'Cockle Bay',
                billingAddressCity: 'Auckland',
                billingAddressPostcode: '2014',
                territory: 'South Wellington',
                customerDemographic: 'Baby Boomer (50-65 ish)',
                estimatedCustomerIncome: 'Pension',
                acquisitionChannel: 'Word of Mouth',
            }

            let jobData = { accountName: 'Davia, Ido',
            workLocationStreetAddress: '56 Kiwi Crescent',
            workLocationSuburb: 'Tawa',
            workLocationCity: '',
            workLocationPostcode: '',
            primaryJobType: 'Maintenance',
            secondaryJobType: '',
            indoorsOutdoors: 'Indoors',
            createdDateTimeNZT: '17/12/2019 22:12:43',
            dateJobEnquiry: '',
            dateJobQuoted: '',
            dateWorkCommenced: '',
            dateInvoiceSent: '2019-12-03',
            amountInvoiced: '2',
            costMaterials: '',
            costSubcontractor: '',
            costTipFees: '',
            costOther: '',
            hoursWorkedDave: '',
            workSatisfaction: '5',
            clientId: '10' }

            applyTestData('client', clientData);
            applyTestData('job', jobData);

            function applyTestData(dim, data){
    
                for (let key in data) {
    
                    let el = document.getElementById(dim + 'Details-' + key);
                    
                    el.value = data[key];
                    
                }
    
            }
    
            applyTestData();

        }

    }

    init();

});
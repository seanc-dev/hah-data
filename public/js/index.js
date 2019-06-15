import forms    from './forms.js';
import handlers from './handlers.js';
import lib      from './library.js';

$(document).ready(function () {

    function init() {

        document.appData = {
            businessName: 'kapiti'
        }

        let $clientDetailsForm  = $('form#clientDetailsForm');

        forms.constructForm('clientDetails');
        forms.constructForm('jobDetails');
        forms.setAccountNameOptions();

        // event handler elements
        let accountNameEles     = $('.account-name'),
            accountNameInput    = $('#clientDetails-accountName');

        // event handlers
        handlers.handleFormTabClick();
        handlers.handleInputFocus();
        handlers.handleFormClear();
        handlers.handleAccountNameBlur();
        handlers.handleJobFormValidationOnClick();
        handlers.handleFormSubmit();

        // handle accountName construction
        accountNameEles.on('input', () => {
            let value = lib.updateAccountName(),
                reg     = /\b(\w*undefined\w*)\b/g;
            if(value === undefined || value.search(reg) > -1) value = '';
            accountNameInput.val(value);
        });

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
                el = $('#clientDetails-accountType')
            } else {
                el = $('[name="' + key + '"]')
            };
            el.val(dummyData[key]);
        }

    }

    init();

});
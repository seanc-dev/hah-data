import constructForm from './forms.js'

$(document).ready(function () {

    function init() {

        constructForm('clientDetails');
        constructForm('jobDetails');

        // event handler elements
        let tabCols             = $('.tab-card'),
            inputs              = $('.form-control'),
            accountNameEles     = $('.account-name'),
            accountNameInput    = $('input[name="accountName"]'),
            accountTypeEl       = $('[name="accountType"]'),
            mainFirstEl         = $('input[name="mainContactFirstName"]'),
            mainLastEl          = $('input[name="mainContactLastName"]'),
            secondaryFirstEl    = $('input[name="secondaryContactFirstName"]'),
            secondaryLastEl     = $('input[name="secondaryContactLastName"]'),
            businessNameEl      = $('input[name="businessName"]');

        // event handlers
        handleFormTabClick(tabCols);
        handleInputFocus(inputs);

        // handle accountName construction
        accountNameEles.on('input', () => {
            let value = updateAccountName(),
                reg     = /\b(\w*undefined\w*)\b/g;
            if(value === undefined || value.search(reg) > -1) value = '';
            // console.log(value);
            accountNameInput.val(value);
        });

        function updateAccountName(){

            let accountTypeVal = capitaliseWords(accountTypeEl.val()),
                businessNameVal = capitaliseWords(businessNameEl.val()),
                mainFirstVal = capitaliseWords(mainFirstEl.val()),
                mainLastVal = capitaliseWords(mainLastEl.val()),
                secondaryFirstVal = capitaliseWords(secondaryFirstEl.val()),
                secondaryLastVal = capitaliseWords(secondaryLastEl.val());

            if(accountTypeVal === 'Business') return businessNameVal;
            if(accountTypeVal === 'Single') return mainLastVal + ', ' + mainFirstVal;
            if(accountTypeVal === 'Couple'){
                if(mainLastVal === secondaryLastVal) return mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryFirstVal;
                return mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryLastVal + ', ' + secondaryFirstVal;
            }
        }

        function capitaliseWords(str){
            if(!str) return
            let wordsArr = str.split(' ');
            for(let i = 0; i < wordsArr.length; i++){
                let word = wordsArr[i]
                wordsArr[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return wordsArr.join(' ');
        }

        // functions
        function handleInputFocus(inputs){
            inputs.focus(function(){
                $(this).closest('div').find('label').addClass('active');
            });
            inputs.blur(function(){
                $(this).closest('div').find('label').removeClass('active');
            });
        }

        function handleFormTabClick(formTabArr) {
            formTabArr.on('click', function () {

                // set clicked tab active and all others inactive
                formTabArr.each(function (i, element) {
                    element.classList.remove("active-tab");
                });
                this.classList.add("active-tab");

                // toggle form content
                $('.form-content').addClass('d-none');

                let clickedTabName = $(this).attr('data-tab-id');
                console.log(clickedTabName)
                $('#' + clickedTabName).removeClass('d-none');

            });
        }

    }

    init();

});
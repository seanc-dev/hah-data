// import {
//     Spinner
// } from 'spin.js';

const lib = {

    capitaliseWords: function (str) {
        if (!str) return
        let wordsArr = str.split(' ');
        for (let i = 0; i < wordsArr.length; i++) {
            let word = wordsArr[i]
            wordsArr[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return wordsArr.join(' ');
    },

    initialiseAppData: function () {

        return axios.get("/" + document.appData.businessName + "/?data=true")
            .then(function (result) {

                return result

            })
            .catch(function (err) {

                console.error("Error in lib.initialiseAppData axios call");
                console.error(err);

            });

    },

    getClientObj: function (accountName) {

        if (!document.appData.clientDetail) return console.error('Cannot retrieve client data, please reload page');

        let clientObj = document.appData.clientDetail.find((obj) => {
            return obj.accountName === accountName
        });

        if (clientObj === -1) clientObj = "No such account name";

        return clientObj;

    },

    getAccountNameValue: function () {

        const accountTypeEl = $('#clientDetails-accountType'),
            mainFirstEl = $('#clientDetails-mainContactFirstName'),
            mainLastEl = $('#clientDetails-mainContactLastName'),
            secondaryFirstEl = $('#clientDetails-secondaryContactFirstName'),
            secondaryLastEl = $('#clientDetails-secondaryContactLastName'),
            businessNameEl = $('#clientDetails-businessName');

        let accountTypeVal = this.capitaliseWords(accountTypeEl.val()),
            businessNameVal = this.capitaliseWords(businessNameEl.val()),
            mainFirstVal = this.capitaliseWords(mainFirstEl.val()),
            mainLastVal = this.capitaliseWords(mainLastEl.val()),
            secondaryFirstVal = this.capitaliseWords(secondaryFirstEl.val()),
            secondaryLastVal = this.capitaliseWords(secondaryLastEl.val());

        if (accountTypeVal === 'Business') return businessNameVal;
        if (accountTypeVal === 'Individual') return mainLastVal + ', ' + mainFirstVal;
        if (accountTypeVal === 'Couple') {
            if (mainLastVal === secondaryLastVal) return mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryFirstVal;
            let val = mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryLastVal + ', ' + secondaryFirstVal;
            console.log('couple type if passed')
            console.log(val)
            return val
        }

    },

    initSpinner: function () {

        const opts = {
            lines: 13, // The number of lines to draw
            length: 38, // The length of each line
            width: 10, // The line thickness
            radius: 45, // The radius of the inner circle
            scale: .2, // Scales overall size of the spinner
            corners: .9, // Corner roundness (0..1)
            color: '##c60062', // CSS color or array of colors
            fadeColor: 'transparent', // CSS color or array of colors
            speed: 1, // Rounds per second
            rotate: 0, // The rotation offset
            animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
            direction: 1, // 1: clockwise, -1: counterclockwise
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            className: 'spinner', // The CSS class to assign to the spinner
            top: '50%', // Top position relative to parent
            left: '50%', // Left position relative to parent
            shadow: '0 0 1px transparent', // Box-shadow for the lines
            position: 'absolute' // Element positioning
        };

        let loadingOverlay = $('#loadingOverlay');
        loadingOverlay.removeClass('d-none');
        loadingOverlay.removeClass('page-loaded');
        loadingOverlay.addClass('submit-loader')
        let target = $('#loadingMessage');
        target.empty();
        let spinner = new Spinner(opts).spin(target[0]);

        loadingOverlay.removeClass('d-none');

        return spinner

    },

    endSpinner: function () {

        $('#loadingOverlay').addClass('d-none');

    },

    removeClassesByRegexp: function ($element, regexp) {

        return $element.removeClass(function (index, className) {
            return (className.match(regexp) || []).join(' ');
        });

    },

    revealStatusMessage: function (dimension, alertType, alertTitle, alertText) {

        if (!dimension || !alertType || !alertText) return new Error("Error: Function activateStatusMessage requires dimension, alertType, and alertText values");

        let $statusDiv = $('#' + dimension + 'DetailsForm').closest('.form-content').find('.status-message');
        let message = alertTitle ? '<strong>' + alertTitle + ':</strong> ' + alertText : alertText;

        $statusDiv.removeClass('d-none');
        lib.removeClassesByRegexp($statusDiv, /(alert-)\w+/g);
        $statusDiv.addClass('alert-' + alertType.toLowerCase());
        $statusDiv.find('span')[0].innerHTML = message
        $statusDiv.focus();

    },

    setCreatedDate: function () {

        let now = new Date();
        now = now.toLocaleString('en-GB').replace(/,/g, '');

        $('input[name="createdDateTimeNZT"]').val(now);

    }
}

export default lib
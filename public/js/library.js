
const lib = {

    capitaliseWords: function (str) {
        if(!str) return
        let wordsArr = str.split(' ');
        for(let i = 0; i < wordsArr.length; i++){
            let word = wordsArr[i]
            wordsArr[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return wordsArr.join(' ');
    },

    getClientObj: function (accountName) {

        if (!document.clients) return console.error('Cannot retrieve client data, please reload page');

        let clientObj = document.clients.find((obj) => {
            return obj.accountName === accountName
        });

        if (clientObj === -1) clientObj = "No such account name";

        return clientObj;

    },

    updateAccountName: function () {

        const   accountTypeEl       = $('#clientDetails-accountType'),
                mainFirstEl         = $('input[name="mainContactFirstName"]'),
                mainLastEl          = $('input[name="mainContactLastName"]'),
                secondaryFirstEl    = $('input[name="secondaryContactFirstName"]'),
                secondaryLastEl     = $('input[name="secondaryContactLastName"]'),
                businessNameEl      = $('#clientDetails-businessName');

        let accountTypeVal      = this.capitaliseWords(accountTypeEl.val()),
            businessNameVal     = this.capitaliseWords(businessNameEl.val()),
            mainFirstVal        = this.capitaliseWords(mainFirstEl.val()),
            mainLastVal         = this.capitaliseWords(mainLastEl.val()),
            secondaryFirstVal   = this.capitaliseWords(secondaryFirstEl.val()),
            secondaryLastVal    = this.capitaliseWords(secondaryLastEl.val());

        if(accountTypeVal === 'Business') return businessNameVal;
        if(accountTypeVal === 'Single') return mainLastVal + ', ' + mainFirstVal;
        if(accountTypeVal === 'Couple'){
            if(mainLastVal === secondaryLastVal) return mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryFirstVal;
            return mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryLastVal + ', ' + secondaryFirstVal;
        }

    }
}

export default lib
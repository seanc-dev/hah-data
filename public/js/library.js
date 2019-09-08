
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

    initialiseAppData: function () {

        return axios.get("/" + document.appData.businessName + "/?data=true")
            .then(function(result){

                return result

            })
            .catch(function(err){

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

        const   accountTypeEl       = $('#clientDetails-accountType'),
                mainFirstEl         = $('#clientDetails-mainContactFirstName'),
                mainLastEl          = $('#clientDetails-mainContactLastName'),
                secondaryFirstEl    = $('#clientDetails-secondaryContactFirstName'),
                secondaryLastEl     = $('#clientDetails-secondaryContactLastName'),
                businessNameEl      = $('#clientDetails-businessName');

        let accountTypeVal      = this.capitaliseWords(accountTypeEl.val()),
            businessNameVal     = this.capitaliseWords(businessNameEl.val()),
            mainFirstVal        = this.capitaliseWords(mainFirstEl.val()),
            mainLastVal         = this.capitaliseWords(mainLastEl.val()),
            secondaryFirstVal   = this.capitaliseWords(secondaryFirstEl.val()),
            secondaryLastVal    = this.capitaliseWords(secondaryLastEl.val());

        if(accountTypeVal === 'Business') return businessNameVal;
        if(accountTypeVal === 'Individual') return mainLastVal + ', ' + mainFirstVal;
        if(accountTypeVal === 'Couple'){
            if(mainLastVal === secondaryLastVal) return mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryFirstVal;
            let val  = mainLastVal + ', ' + mainFirstVal + ' & ' + secondaryLastVal + ', ' + secondaryFirstVal;
            console.log('couple type if passed')
            console.log(val)
            return val
        }

    },

    setCreatedDate: function() {

        let now = new Date();
        now = now.toLocaleString('en-GB').replace(/,/g, '');

        $('input[name="createdDateTimeNZT"]').val(now);
        
    }
}

export default lib
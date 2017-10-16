$(document).ready(function() {

    $("#clientForm").on("submit", function(e) {

        console.log(clientForm);
        writeForm(e);
        e.preventDefault();

    });

    function writeForm (e) {

    	var accountName = $("#accountName").val();
		var mainContactFirstName = $("#mainContactFirstName").val();
		var mainContactLastName = $("#mainContactLastName").val();
		var mainContactEmail = $("#mainContactEmail").val();
		var mainContactLandline = $("#mainContactLandline").val();
		var mainContactMobile = $("#mainContactMobile").val();
		var businessName = $("#businessName").val();
		var billingStreetAddress = $("#billingStreetAddress").val();
		var billingAddressSuburb = $("#billingAddressSuburb").val();
		var territory = $("#territory").val();
		var customerDemographic = $("#customerDemographic").val();
		var estimatedCustomerIncome = $("#estimatedCustomerIncome").val();
		var acquisitionChannel = $("#acquisitionChannel").val();

    	console.log(accountName)

    }

});
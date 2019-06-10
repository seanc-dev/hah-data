import constructForm from './forms.js'

$(document).ready(function () {

    // VARIABLES
    // event handler elements
    var tabCols = $('.tab-card')

    function init() {

        // event handlers
        handleFormTabs(tabCols);
        // constructForm('clientForm', formDetail.clientDetailsForm);
        // constructForm('jobForm', formDetail.jobDetailsForm);

        function handleFormTabs(formTabArr) {
            formTabArr.on('click', function () {
                formTabArr.each(function (i, element) {
                    element.classList.remove("active-tab");
                });
                this.classList.add("active-tab");
                var bodySections = $('.body-section')
                bodySections.each(function (i, element) {
                    element.classList.add('d-none');
                });
                var activeSection = $(this).find('span').text().toLowerCase();
                $('#' + activeSection).removeClass('d-none');
            });
        }

        constructForm('clientDetails');

    }

    init();

});
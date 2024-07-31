
$(document).ready(function() {
    $.ajax({
        url: '/session',
        method: 'GET',
        success: function(response) {
            if (response.loggedIn) {
                $('#loginLink').addClass('d-none');
                $('#logoutLink').removeClass('d-none');
                $('#myPageLink').removeClass('d-none');
                $('#checklistLink').removeClass('d-none');
                $('#chatbotLink').removeClass('d-none');
                $('#newsletterLink').removeClass('d-none');

            } else {
                $('#loginLink').removeClass('d-none');
                $('#logoutLink').addClass('d-none');
                $('#myPageLink').addClass('d-none');
                $('#checklistLink').addClass('d-none');
                $('#chatbotLink').addClass('d-none');
                $('#newsletterLink').addClass('d-none');
            }
        },
        error: function(error) {
            console.error('Error checking session:', error);
        }
    });
});

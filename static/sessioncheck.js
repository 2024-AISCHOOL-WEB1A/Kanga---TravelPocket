$(document).ready(function() {
    $.ajax({
        url: '/session',
        method: 'GET',
        success: function(response) {
            if (response.loggedIn) {
                $('#loginLink').addClass('d-none');
                $('#logoutLink').removeClass('d-none');
                $('#myPageLink').removeClass('d-none');
            } else {
                $('#loginLink').removeClass('d-none');
                $('#logoutLink').addClass('d-none');
                $('#myPageLink').addClass('d-none');
            }
        },
        error: function(error) {
            console.error('Error checking session:', error);
        }
    });
});

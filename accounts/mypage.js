document.addEventListener("DOMContentLoaded", function() {
    const profileImg = document.getElementById("profileImg");
    const imageInput = document.getElementById("imageInput");

    profileImg.addEventListener("click", function() {
    imageInput.click();
    });

    imageInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
        profileImg.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
    });
});
const destinationInput = document.getElementById('destination');
const dropdown = document.getElementById('dropdown');
const dateGroup = document.getElementById('dateGroup');
const guestGroup = document.getElementById('guestGroup');

destinationInput.addEventListener('focus', () => {
    dropdown.style.display = 'block';
});

dropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIV') {
        destinationInput.value = e.target.textContent;
        dropdown.style.display = 'none';
        dateGroup.style.display = 'flex';
    }
});

document.getElementById('checkout').addEventListener('change', () => {
    guestGroup.style.display = 'flex';
});

document.getElementById("submitBtn").addEventListener('click', () => {
    const selectedDestination = destinationInput.value;
    const checkinDate = document.getElementById('checkin').value;
    const checkoutDate = document.getElementById('checkout').value;

    const selectedGuests = [];
    document.querySelectorAll('.guest-group input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedGuests.push(checkbox.parentElement.textContent.trim());
        }
    });

    console.log("Selected destination:", selectedDestination);
    console.log("Check-in date:", checkinDate);
    console.log("Check-out date:", checkoutDate);
    console.log("Selected guests:", selectedGuests);

    const data = [selectedDestination, checkinDate, checkoutDate, selectedGuests];
    console.log(data);
});

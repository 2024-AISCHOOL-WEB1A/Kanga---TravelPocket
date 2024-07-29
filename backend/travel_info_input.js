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

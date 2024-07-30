const destinationInput = document.getElementById('destination');
const dropdown = document.getElementById('dropdown');
const dateGroup = document.getElementById('dateGroup');
const guestGroup = document.getElementById('guestGroup');

destinationInput.addEventListener('focus', () => {
    dropdown.style.display = 'block';
});

destinationInput.addEventListener('input', () => {
    const filter = destinationInput.value.toLowerCase();
    const items = dropdown.getElementsByTagName('div');
    for (let i = 0; i < items.length; i++) {
        const text = items[i].textContent || items[i].innerText;
        items[i].style.display = text.toLowerCase().indexOf(filter) > -1 ? '' : 'none';
    }
});

dropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIV') {
        destinationInput.value = e.target.textContent;
        dropdown.style.display = 'none';
        dateGroup.style.display = 'flex';
    }
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== destinationInput) {
        dropdown.style.display = 'none';
    }
});

document.getElementById('checkout').addEventListener('change', () => {
    guestGroup.style.display = 'flex';
});

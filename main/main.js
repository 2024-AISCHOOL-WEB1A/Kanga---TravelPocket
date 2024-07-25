document.addEventListener('DOMContentLoaded', function() {
	const airplane = document.getElementById('airplane');

	function animateAirplane() {
			airplane.style.animation = 'moveAirplane 2s infinite';
	}

	animateAirplane();

	window.addEventListener('wheel', function(event) {
			if (event.deltaY > 0) {
					// Scroll down
					const currentSection = document.querySelector('.section.active') || document.querySelector('.section');
					const nextSection = currentSection.nextElementSibling;
					if (nextSection && nextSection.classList.contains('section')) {
							currentSection.classList.remove('active');
							nextSection.classList.add('active');
							nextSection.scrollIntoView({ behavior: 'smooth' });
					}
			} else {
					// Scroll up
					const currentSection = document.querySelector('.section.active') || document.querySelector('.section');
					const prevSection = currentSection.previousElementSibling;
					if (prevSection && prevSection.classList.contains('section')) {
							currentSection.classList.remove('active');
							prevSection.classList.add('active');
							prevSection.scrollIntoView({ behavior: 'smooth' });
					}
			}
	});

	// Set the first section as active initially
	document.querySelector('.section').classList.add('active');
});

document.addEventListener('DOMContentLoaded', function() {
	const airplane = document.getElementById('airplane');
	const pouch = document.getElementById('pouch');

	airplane.addEventListener('mouseover', function() {
			airplane.style.animation = 'moveAirplane 2s infinite';
	});

	airplane.addEventListener('mouseout', function() {
			airplane.style.animation = 'none';
	});

	pouch.addEventListener('mouseover', function() {
			pouch.style.animation = 'movePouch 2s infinite';
	});

	pouch.addEventListener('mouseout', function() {
			pouch.style.animation = 'none';
	});
});

document.addEventListener('DOMContentLoaded', function() {
	const travelQuestion = document.getElementById('travel-question'); // 추가된 코드
	const section2 = document.getElementById('section2'); // 추가된 코드

	travelQuestion.addEventListener('click', function() {
			section2.scrollIntoView({ behavior: 'smooth' });
	});
});

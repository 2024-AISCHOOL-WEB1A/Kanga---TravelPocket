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
// 1번 페이지 기능



/* Please ❤ this if you like it! */




/* Please ❤ this if you like it! */


(function($) { "use strict";

	$(function() {
		var header = $(".start-style");
		$(window).scroll(function() {    
			var scroll = $(window).scrollTop();
		
			if (scroll >= 10) {
				header.removeClass('start-style').addClass("scroll-on");
			} else {
				header.removeClass("scroll-on").addClass('start-style');
			}
		});
	});		
		
	//Animation
	
    
	$(document).ready(function() {
		$('body.hero-anime').removeClass('hero-anime');
	});

	//Menu On Hover
		
	$('body').on('mouseenter mouseleave','.nav-item',function(e){
			if ($(window).width() > 750) {
				var _d=$(e.target).closest('.nav-item');_d.addClass('show');
				setTimeout(function(){
				_d[_d.is(':hover')?'addClass':'removeClass']('show');
				},1);
			}
	});	
	
	//Switch light/dark
	
	$("#switch").on('click', function () {
		if ($("body").hasClass("dark")) {
			$("body").removeClass("dark");
			$("#switch").removeClass("switched");
		}
		else {
			$("body").addClass("dark");
			$("#switch").addClass("switched");
		}
	});  
	
  })(jQuery); 





  const slider = document.querySelector('.slider');

function activate(e) {
  const items = document.querySelectorAll('.item');
  e.target.matches('.next') && slider.append(items[0])
  e.target.matches('.prev') && slider.prepend(items[items.length-1]);
}

document.addEventListener('click',activate,false);
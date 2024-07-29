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

<<<<<<< HEAD
// top버튼, 메뉴바
// 스크롤할 때 호출되는 함수
window.onscroll = function() {
	scrollFunction();
	toggleNavbar();
};

// 스크롤 버튼 보이기/숨기기
function scrollFunction() {
	const scrollToTopBtn = document.getElementById("scrollToTop");
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			scrollToTopBtn.style.display = "block";
	} else {
			scrollToTopBtn.style.display = "none";
	}
}

// 스크롤 버튼 클릭 시 페이지 맨 위로 이동
function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

// 메뉴바 토글 함수
function toggleNavbar() {
	const navbar = document.querySelector('.navigation-wrap');
	if (window.scrollY > 50) {
			navbar.classList.add('navbar-hide');
	} else {
			navbar.classList.remove('navbar-hide');
	}
}

// 메뉴바 마우스 오버 시 나타나기


=======

document.addEventListener("DOMContentLoaded", function() {
    const includeElements = document.querySelectorAll('[data-include-path]');
    
    includeElements.forEach(el => {
        const includePath = el.getAttribute('data-include-path');
        
        fetch(includePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                el.innerHTML = data;
            })
            .catch(error => {
                console.error('Error including path:', error);
                el.innerHTML = '<p>Error loading content. Please try again later.</p>';
            });
    });
});
>>>>>>> f22a59a6447ef33c19be34fc3efe5c506ae86b1d

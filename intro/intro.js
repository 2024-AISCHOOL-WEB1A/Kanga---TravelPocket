// 버튼과 메인 페이지 URL 설정
let scrollToMainButton = document.getElementById("scrollToMain");
let mainPageURL = "/main"; // 이동할 HTML 파일

scrollToMainButton.addEventListener("click", () => {
  // 해당 버튼을 클릭하면 지정된 URL로 페이지 이동
  window.location.href = mainPageURL;
});

// 나머지 코드
let btn = document.querySelector("button");
let heading = document.querySelector("h1.main-animation");
let initialMessages = document.querySelectorAll(".initial-message");
let infoMessage = document.querySelector("h1.info-message");
let words = heading.querySelectorAll(".word");
let hash = heading.querySelector(".hash");
let reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;

if (!reducedMotion) {
  function showInitialMessages() {
    let tl = gsap.timeline();

    initialMessages.forEach((message, index) => {
      tl.to(message, {
        display: 'block',
        opacity: 1,
        duration: 1,
        delay: index === 0 ? 0 : 1, // 첫 번째 문구는 바로 나타나고, 그 이후 문구는 1초 후에 나타남
        onComplete: () => {
          gsap.to(message, {
            opacity: 0,
            duration: 0,
            delay: 0,
            onComplete: () => {
              document.body.classList.add('black-bg');
              // 여기서 검은색 배경을 얼마 동안 표시할지 조정할 수 있습니다.
              // 예를 들어, 0.5초 동안만 표시하고 싶다면 아래와 같이 설정할 수 있습니다.
              setTimeout(() => {
                document.body.classList.remove('black-bg');
                gsap.to(heading, { display: 'flex', duration: 0, onComplete: startMainAnimation });
              }, 2000); // 2초 (2000밀리초) 초 수정시  문구 중첩 됨 // 마지막 문구일 때만 showInfoMessage 호출
          }});
        }
      });
    });
  }

  function showInfoMessage() {
    gsap.set(infoMessage, { display: 'block', opacity: 0 });
    gsap.to(infoMessage, {
      opacity: 1,
      duration: 2,
      onComplete: () => {
        gsap.to(infoMessage, {
          opacity: 0,
          duration: 0,
          delay: 0,
          onComplete: () => {
            document.body.classList.add('black-bg');
            gsap.to(heading, { display: 'flex', duration: 0, onComplete: startMainAnimation });
          }
        });
      }
    });
  }

  function startMainAnimation() {
    let tl = gsap.timeline();

    tl.set(heading, {
      scale: 0.25,
      opacity: 0
    })
      .to(heading, {
        scale: 0.4,
        opacity: 1,
        duration: 0.7,
        ease: "power4.out"
      })

      // Byebye hash
      .to(
        hash,
        {
          scale: 0,
          duration: 0.4,
          ease: "back.in(1.6)"
        },
        "-=0.2"
      )

      // Part words
      .to(words[0], {
        xPercent: -20,
        duration: 0.8,
        ease: "elastic.out(0.7, 0.2)"
      })
      .to(
        words[1],
        {
          xPercent: -20,
          duration: 0.8,
          ease: "elastic.out(0.7, 0.2)"
        },
        "<"
      )
      .to(
        words[2],
        {
          xPercent: 5,
          duration: 0.8,
          ease: "elastic.out(0.7, 0.2)"
        },
        "<"
      )

      // Scale up heading
      .to(
        heading,
        {
          scale: 1.001,
          y: 0,
          duration: 0.5,
          ease: "back.in(1.5)"
        },
        "-=0.3"
      )

      // Stack words
      .to(
        words[1],
        {
          scaleX: 1.8,
          scaleY: 2.2,
          duration: 0.4,
          ease: "expo.inOut"
        },
        "<+=0.1"
      )
      .to(
        words[0],
        {
          yPercent: -150,
          xPercent: 40,
          duration: 0.3,
          ease: "power4.out"
        },
        "<"
      )
      .to(
        words[1],
        {
          xPercent: -70,
          duration: 0.3,
          ease: "power4.out"
        },
        "<"
      )
      .to(
        words[2],
        {
          yPercent: 150,
          xPercent: -110,
          duration: 0.3,
          ease: "power4.out"
        },
        "<"
      )

      .to(
        heading,
        {
          scale: 1.1,
          duration: 0.3,
          ease: "power4.out"
        },
        "-=0.2"
      )

      // Elastic finish
      .to(heading, {
        scale: 1,
        duration: 0.3,
        ease: "power4.out"
      })
      .to(
        words[0],
        {
          yPercent: -100,
          xPercent: 40,
          duration: 0.6,
          ease: "elastic.out(0.6,0.2)"
        },
        "<"
      )

      .to(
        words[1],
        {
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(0.6,0.2)"
        },
        "<"
      )
      .to(
        words[2],
        {
          yPercent: 100,
          duration: 0.6,
          ease: "elastic.out(0.6,0.2)"
        },
        "<"
      )

      // Pattern reveal
      .to(
        document.body,
        {
          "--pattern-opacity": 1,
          duration: 0.1
        },
        "<"
      )
      .set(btn, { display: "block" })
      .fromTo(
        btn,
        { scale: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power4.out"
        }
      );
  }

  // Start the initial animation
  showInitialMessages(); // 초기 메시지 표시 함수 호출
}

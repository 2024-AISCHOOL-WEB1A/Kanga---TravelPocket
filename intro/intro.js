// intro.js

let btn = document.querySelector("button");
let heading = document.querySelector("h1.main-animation");
let initialMessage = document.querySelector("h1.initial-message");
let infoMessage = document.querySelector("h1.info-message");
let words = heading.querySelectorAll(".word");
let hash = heading.querySelector(".hash");
let reducedMotion = window.matchMedia("(prefers-reduced-motion)").matches;

if (!reducedMotion) {
  function showInitialMessage() {
    gsap.set(initialMessage, { display: 'block', opacity: 0 });
    gsap.to(initialMessage, {
      opacity: 1,
      duration: 2,
      onComplete: () => {
        gsap.to(initialMessage, {
          opacity: 0,
          duration: 1,
          delay: 2,
          onComplete: showInfoMessage
        });
      }
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
          duration: 1,
          delay: 2,
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

  btn.addEventListener("click", () => {
    gsap.set([initialMessage, infoMessage], { display: "none" });
    document.body.classList.remove("black-bg");
    heading.style.display = "none";
    gsap.set(btn, { display: "none" });
    showInitialMessage();
  });

  // Start the initial animation
  showInitialMessage();
}
